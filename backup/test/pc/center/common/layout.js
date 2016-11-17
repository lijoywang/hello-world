/**
 * @file 页面整体布局以及账户信息的拉取渲染
 * @author zhujialu
 */
define(function (require, exports, module) {

    'use strict';

    var toNumber = require('cc/function/toNumber');
    var urlUtil = require('cc/util/url');
    var instanceUtil = require('cc/util/instance');

    var support = require('common/support');
    var storage = require('common/storage');
    var config = require('./config');
    var validatePattern = require('common/validatePattern');

    var getElement = require('common/extension/getElement');
    var bindData = require('common/extension/bindData');

    var ui = require('../../common/ui');

    var service = require('./service');
    var constant = require('./constant');

    exports.init = function () {

        support.init();
        storage.init();
        validatePattern.init();

        $.extend(
            Ractive.defaults.data,
            {
                compressImage: require('common/filter/compressImage'),
                cutString: require('common/filter/cutString'),
                divide: require('common/filter/divide'),
                formatCardNumber: require('common/filter/formatCardNumber'),
                formatDate: require('common/filter/formatDate'),
                formatDateTime: require('common/filter/formatDateTime'),
                formatMask: require('common/filter/formatMask'),
                formatMobile: require('common/filter/formatMobile'),
                formatMoney: require('common/filter/formatMoney'),
                formatNumber: require('common/filter/formatNumber'),
                formatTime: require('common/filter/formatTime'),
                joinList: require('common/filter/joinList'),
                minus: require('common/filter/minus'),
                multiply: require('common/filter/multiply'),
                plus: require('common/filter/plus')
            }
        );

        Ractive.defaults.getElement = function () {
            return getElement(this);
        };

        Ractive.defaults.bindData = function (map) {
            return bindData(this, map);
        };

        // 一般这两个只会用其中一个
        // 一个触发另一个就不用触发了
        Ractive.defaults.onrender =
        Ractive.defaults.oncomplete = function () {
            var onReady = this.get('options.onReady');
            if ($.isFunction(onReady) && !this.hasReadyExecuted) {
                onReady();
                this.hasReadyExecuted = true;
            }
        };

        var data = urlUtil.parseQuery(location.hash);

        data.TAB_INDEX = constant.TAB_INDEX;
        data.TAB_ACCOUNT = constant.TAB_ACCOUNT;
        data.TAB_FUND = constant.TAB_FUND;

        data.utl = {};

        data.userName = '';
        if (!data.tab) {
            data.tab = constant.TAB_INDEX;
        }

        var instance = new Ractive({
            el: '#app',
            template: require('tpl!./layout.html'),
            data: data,
            components: {
                Footer: require('pc/common/component/Footer')
            },
            oncomplete: function () {
                ui.init();
                instanceUtil.window.on('hashchange', function () {
                    instance.set(
                        urlUtil.parseQuery(location.hash)
                    );
                });
            },
            quit: function () {
                service
                .quit()
                .then(function () {
                    location.href = data.url.quitUrl;
                });
            }
        });

        window.layoutInstance = instance;


        window.siteData = {

        };

        window.userData = { };

        return service.getUserInfo()
        .then(function (response) {
            var data = response.data;
            var userRole = toNumber(data.user_role);
            var user = {
                displayName: data.name,
                mobile: data.mobile,
                role: userRole,
                number: data.user_number,
                avatar: data.avatar,
                isInstitution: userRole == constant.USER_ROLE_INSTITUTION,
                isTeacher: userRole == constant.USER_ROLE_TEACHET,
                isStudent: userRole == constant.USER_ROLE_STUDENT
            };
            $.extend(window.userData, user);
            instance.set('userName', user.displayName);

            config.init();

            var urlData = {
                homeUrl: config.roleUrl[userData.role].homeUrl,
                centerUrl: config.roleUrl[userData.role].centerUrl,
                quitUrl: config.roleUrl[userData.role].quitUrl,
                helpUrl: config.roleUrl[userData.role].helpUrl
            };
            instance.set('url', urlData);
        });

    };

});