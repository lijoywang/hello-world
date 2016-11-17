/**
 * Created by xuzheng on 15/12/25.
 */
define(function (require) {
    'use strict';

    var util_base = require('util/base');
    var util_function = require('util/function');
    var Jockey = require('jockey');
    var observer = require('common/mvc/observer');
    var appConfig = require('app_config');

    var env = require('util/env');

    var exports = {};

    var getJockeyConfig = util_function.lazyConst(function () {
        if (!isApp()) {
            return {};
        }
        var filter = {
            'jockey': true
        };
        if (isStudentApp()) {
            filter['app'] = 'student';
        } else if (isTeacherApp()) {
            filter['app'] = 'teacher';
        } else if (isOrgApp()) {
            filter['app'] = 'org';
        } else if (isKaoYanApp()) {
            filter['app'] = 'kaoyan';
        }
        if (env.os.isIOS) {
            filter['ios'] = env.app.version.toString();
        } else if (env.os.isAndroid) {
            filter['android'] = env.app.version.toString();
        }
        return appConfig.get(filter);
    });

    function createToken() {
        return 'm_' + new Date().getTime().toString(36);
    }

    function createActionData(actionName, data, callback) {
        var token = createToken();

        var listener = observer.addListener(callbackObj, 'cb_' + token, function (data) {
            observer.removeListener(listener);
            listener = null;
            if (util_base.isFunction(callback)) {
                try {
                    callback(data);
                } catch (ex) {
                }
            }
        });

        return {
            name: actionName,
            data: data,
            token: token
        };
    }


    var callbackObj = {};
    //监听app的回调事件
    Jockey.on('callback', function (action) {
        if (action) {
            var token = action.token;
            observer.trigger(callbackObj, 'cb_' + token, action.data);
        }
    });

    var actionObj = {};
    //监听app的主动调用
    Jockey.on('action', function (action) {
        if (action) {
            var actionName = action.name;
            if (observer.exist(actionObj, actionName)) {
                observer.trigger(actionObj, actionName, action);
            } else {
                Jockey.send('callback', {
                    'code': -1,
                    'token': action.token
                });
            }
        }
    });

    function send(actionName, actionData, callback) {
        if (!actionName || !support(actionName)) {
            return false;
        }
        var config = getJockeyConfig();
        if (config[actionName].old) {
            Jockey.send(actionName, actionData);
        } else {
            var eventData = createActionData(actionName, actionData, callback);
            Jockey.send('action', eventData);
        }
    }

    function on(actionName, callback) {
        if (!actionName || !exports.support(actionName)) {
            return false;
        }
        var config = getJockeyConfig();
        if (config[actionName].old) {
            Jockey.on(actionName, callback);
        } else {
            return observer.addListener(actionObj, actionName, function (action) {
                var token = action.token;
                var data = action.data;
                var rst;
                var isSendCallback = false;
                var done = function (callbackData) {
                    if (isSendCallback) {
                        return;
                    }
                    isSendCallback = true;
                    var cbData = {
                        'code': 0,
                        'token': token,
                        'data': null
                    };
                    if (arguments.length > 0) {
                        cbData['data'] = callbackData
                    }
                    Jockey.send('callback', cbData);
                };
                if (util_base.isFunction(callback)) {
                    rst = callback(data, done);
                }
                if (rst !== false) {
                    done();
                }
            });
        }
    }


    function support(actionName) {
        var config = getJockeyConfig();
        return actionName in config;
    }

    function isApp() {
        return isStudentApp() || isTeacherApp() || isOrgApp() || isKaoYanApp();
    }

    function appVersion() {
        if (isApp()) {
            return env.app.version.val;
        }
        return '';

    }

    function isStudentApp() {
        return env.app.name == 'student';
    }

    function isTeacherApp() {
        return env.app.name == 'teacher';
    }

    function isKaoYanApp() {
        return env.app.name == "kaoyan";
    }

    function isOrgApp() {
        return env.app.name == 'org';
    }


    function version2Number(strVersion) {
        if (!strVersion) {
            return 0;
        }
        var arr = strVersion.split('.');
        var num = 0;
        num += Number(arr[0]) * 1E4;
        num += Number(arr[1]) * 1E2;
        num += Number(arr[2]);
        return isNaN(num) ? 0 : num;
    }

    var openNewWindow = (function () {
        var lastTime = +new Date;
        return function (url) {
            if (support('toNewWindow')) {
                var now = +new Date;
                if (now - lastTime > 2000) {
                    lastTime = now;
                    send('toNewWindow', {
                        url: url,
                        web_url: url
                    });
                }
            }
        };
    })();

    exports.imChat = function (param) {
        var data = {
            'c_id': param.c_id + '',
            'c_role': param.c_role + ''
        };
        if (param.group_id) {
            data['group_id'] = param.group_id + '';
        }
        Jockey.send('IM', data);
    };




    exports.send = send;
    exports.on = on;
    exports.support = support;

    exports.isApp = isApp;
    exports.appVersion = appVersion;
    exports.isStudentApp = isStudentApp;
    exports.isTeacherApp = isTeacherApp;
    exports.isOrgApp = isOrgApp;

    exports.openNewWindow = openNewWindow;
    exports.version2Number = version2Number;
    exports.isKaoYanApp = isKaoYanApp;
    exports.init = function () {

    };

    return exports;
});