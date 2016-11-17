/**
 * @file 充值
 * @author zhujialu
 */
define(function (require, exports, module) {

    'use strict';

    var service = require('../common/service');

    var urlUtil = require('cc/util/url');
    var toNumber = require('cc/function/toNumber');
    var Validator = require('../../common/custom/form/Validator');

    var optype = require('../common/optype');

    exports.init = function () {

        var instance = new Ractive({
            el: '#container',
            template: require('tpl!./index.html'),
            data: {
                totalConsume: 0,
                totalRecharge: 0,
                balance: 0,
                tabIndex: 0,
                list: [],
                pagerOptions: {
                    page: 0,
                    count: 0
                },
                getOptypeText: function (code) {
                    return optype[code] || '';
                }
            },
            components: {
                Pager: require('../../common/component/Pager')
            },
            onrender: function () {

                this.observe('pagerOptions.page', function (page) {
                    if (page >= 0) {
                        this.loadRecord();
                    }
                });

                this.observe('tabIndex', function () {
                    if (this.get('pagerOptions.page') > 1) {
                        this.set('pagerOptions.page', 1);
                    }
                    else {
                        this.loadRecord();
                    }
                });

            },
            loadRecord: function () {

                var page = this.get('pagerOptions.page');
                if (page > 0) {}
                else {
                    this.set('pagerOptions.page', 1);
                    return;
                }

                service
                .getWalletRecord({
                    type: this.get('tabIndex'),
                    page: page,
                    pageSize: 10
                })
                .then(function (response) {

                    var data = response.data;

                    instance.set({
                        'pagerOptions.count': data.pager.total_page,
                        list: data.list
                    });

                });
            }
        });

        service
        .getWalletBalance()
        .then(function (response) {
            var data = response.data;
            instance.set({
                totalConsume: data.used,
                totalRecharge: data.income,
                balance: data.balance
            });
        });



    };

});