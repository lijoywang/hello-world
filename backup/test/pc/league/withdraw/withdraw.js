/**
 * @file 提现
 * @author zhujialu
 */
define(function (require, exports, module) {

    'use strict';

    var service = require('../service');

    var urlUtil = require('cc/util/url');
    var toNumber = require('cc/function/toNumber');
    var Validator = require('../../common/custom/form/Validator');

    var fee = 1;

    exports.init = function () {

        var query = urlUtil.parseQuery(location.search);
        var leagueId = query.league_id;

        var instance = new Ractive({
            el: '#container',
            template: require('tpl!./withdraw.html'),
            data: {
                leagueId: leagueId,
                accountMobile: query.account_mobile,
                submiting: false,
                success: false,

                cardList: null,
                drawCashMoeny: 0,

                amountInputOptions: {
                    name: 'amount',
                    className: 'amount-input',
                    value: ''
                },
                cardSelectOptions: {
                    name: 'card',
                    className: 'card-select',
                    defaultText: '请选择',
                    data: null,
                    value: ''
                }
            },
            components: {
                Input: require('../../common/component/Input'),
                Select: require('../../common/component/Select')
            },
            onrender: function () {

                var me = this;

                var container = $(me.getElement());

                me.validator = new Validator({
                    mainElement: container,
                    fields: {
                        amount: {
                            rules: {
                                required: true,
                                pattern: 'positive',
                                custom: function (data) {
                                    return toNumber(data.value, 0, 'float') + fee <= me.get('drawCashMoney');
                                }
                            },
                            errors: {
                                required: '请输入提现金额',
                                pattern: '请输入正数',
                                custom: '超出最大可提现金额'
                            }
                        }
                    }
                });

            },
            submit: function () {
                var me = this;
                if (me.validator.validate()) {

                    var amount = toNumber(
                        this.get('amountInputOptions.value'),
                        0
                    );

                    me.set('submiting', true);

                    service
                    .accountDrawCash({
                        leagueId: leagueId,
                        amount: amount + fee,
                        fee: fee
                    })
                    .then(function (response) {
                        me.set('success', true);
                    })
                    .always(function () {
                        me.set('submiting', false);
                    });
                }
            }
        });

        service
        .getAccountDrawCashDetail({
            leagueId: leagueId
        })
        .then(function (response) {

            var data = response.data;

            instance.set({
                cardList: data.card_list,
                drawCashMoney: data.draw_cash_money,
                'cardSelectOptions.data': $.map(
                    data.card_list,
                    function (item) {
                        return {
                            text: item.bank_name,
                            value: item.bank_no
                        };
                    }
                )
            });

        });

    };

});