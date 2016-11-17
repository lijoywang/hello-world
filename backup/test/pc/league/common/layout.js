/**
 * @file 页面整体布局以及账户信息的拉取渲染
 * @author zhujialu
 */
define(function (require, exports, module) {

    'use strict';

    var support = require('common/support');
    var storage = require('common/storage');
    var config = require('common/config');

    var getElement = require('common/extension/getElement');
    var bindData = require('common/extension/bindData');

    var ui = require('../../common/ui');

    var urlUtil = require('cc/util/url');

    var service = require('../service');

    exports.init = function () {

        support.init();
        storage.init();

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

        var query = urlUtil.parseQuery(location.search);
        var leagueId = query.league_id || '';

        var rootHttp = 'http://';

        if (config.ENV === 'test') {
            rootHttp += config.ENV + '-';
        }

        rootHttp += 'lm.genshuixue.com';

        new Ractive({
            el: '#app',
            template: require('tpl!./layout.html'),
            data: {
                leagueId: leagueId,
                accountMobile: query.account_mobile || '',
                rootHttp: rootHttp
            },
            oncomplete: function () {
                ui.init();
            }
        });

        service
        .getUserInfo(
            {
                leagueId: leagueId
            },
            {
                preventError: true
            }
        )
        .then(null, function (response) {
            confirm({
                type: 'error',
                title: '提示',
                content: '当前账户已过期，请重新登录',
                buttons: [
                    {
                        text: '去登录',
                        type: 'error',
                        action: function () {
                            location.href = rootHttp;
                        }
                    }
                ]
            });
        });

    };

});