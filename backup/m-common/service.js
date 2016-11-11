/**
 * Created by xuzheng on 16/1/6.
 */
define(function (require, exports) {
    'use strict';

    var app = require("common/app");

    var defaultErrorMessage = '网络请求失败, 请稍后重试';
    var app = require('common/app');
    var user = require('common/user');
    var isApp = app.isApp();


    function alertErrorInfo(response) {
        require(['common/ui'], function (ui) {
            ui.alert({
                'content': response.message || response.msg || defaultErrorMessage,
                'button': '确定'
            });
        });
    }

    function send(type, url, data, callback) {
        function handler(response) {
            var disableError = false;
            if (callback) {
                disableError = callback(response) === false;
            }
            //callback返回false
            if(!disableError){
                //未登陆
                if(response.code == "900006"){
                    require(['common/ui'], function (ui) {
                        ui.confirm({
                            'content': "您尚未登录，请前往登录",
                            'button': '登陆'
                        }).done(function(){
                            if(isApp) {
                                user.loginStudent();
                            }
                            else {
                                location.href = "/static/login?next="+encodeURIComponent(location.href.split("?")[0]);
                            }
                        });
                    });

                    return false;
                }

                if (response.code != 0) {
                    alertErrorInfo(response);
                }
            }
        }

        require(['zepto'], function ($) {
            $[type == 1 ? 'get' : 'post'](url, data,function (response) {
                handler(response);
            }).fail(function () {
                    handler({
                        'code': -1
                    });
                });
        });
    }

    exports.get = function (url, data, callback) {
        send(1, url, data, callback);
    };

    exports.post = function (url, data, callback) {
        send(2, url, data, callback);
    };
});