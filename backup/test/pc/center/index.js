/**
 * @file 入口
 * @author zhujialu
 */
define(function (require, exports, module) {

    'use strict';

    var constant = require('./common/constant');

    exports.init = function () {

        var instance = new Ractive({
            el: '#main',
            template: require('tpl!./index.html'),
            data: {
                tab: layoutInstance.get('tab'),
                sub_tab: layoutInstance.get('sub_tab'),
                TAB_INDEX: constant.TAB_INDEX,
                TAB_ACCOUNT: constant.TAB_ACCOUNT,
                TAB_FUND: constant.TAB_FUND
            },
            components: {
                Home: require('./home/home'),
                Account: require('./account/account'),
                RecordDetails: require('./recordDetails/recordDetails')
            },
            oncomplete: function () {
                layoutInstance.observe('tab', function (tab) {
                    instance.set('tab', tab);
                });
                layoutInstance.observe('sub_tab', function (sub_tab) {
                    instance.set({
                        'sub_tab': sub_tab
                    });
                });
            }
        });

    };

});