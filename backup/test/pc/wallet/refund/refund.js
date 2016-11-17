/**
 * @file 退费
 * @author zhujialu
 */
define(function (require, exports, module) {

    'use strict';

    var toNumber = require('cc/function/toNumber');

    var service = require('../common/service');

    var Validator = require('../../common/custom/form/Validator');

    exports.init = function () {

        var refresh = function (response) {
            service
            .getWalletBalance()
            .then(function (response) {
                var data = response.data;
                instance.set({
                    balance: toNumber(data.balance, 0),
                    hasPayPassword: data.has_password
                });
            });
            return response;
        };

        var instance = new Ractive({
            el: '#container',
            template: require('tpl!./refund.html'),
            data: {
                balance: 0,
                result: '',
                hasPayPassword: false,
                orgNumber: siteData.orgNumber,
                orgHost: siteData.orgHost,
                amountInputOptions: {
                    className: 'amount-input',
                    name: 'amount',
                    value: ''
                },
                payPasswordInputOptions: {
                    className: 'pay-password-input',
                    name: 'payPassword',
                    type: 'password',
                    value: ''
                }
            },
            components: {
                Input: require('../../common/component/Input')
            },
            onrender: function () {

                this.validator = new Validator({
                    mainElement: $(this.getElement()),
                    fields: {
                        amount: {
                            sequence: ['required', 'positive', 'decimal', 'max'],
                            rules: {
                                required: true,
                                positive: function (data) {
                                    return data.value > 0;
                                },
                                decimal: function (data) {
                                    var terms = data.value.split('.');
                                    if (terms[1]) {
                                        if (terms[1].length > 2) {
                                            return false;
                                        }
                                    }
                                    return true;
                                },
                                max: function (data) {
                                    return data.value <= instance.get('balance');
                                }
                            },
                            errors: {
                                required: '请输入转出金额',
                                positive: '请输入正数',
                                decimal: '小数点不能超过两位',
                                max: '转出金额大于推广余额'
                            }
                        },
                        payPassword: {
                            rules: {
                                required: true
                            },
                            errors: {
                                required: '请输入支付密码'
                            }
                        }
                    }
                });

            },
            submit: function () {
                if (instance.validator.validate()) {

                    service
                    .refund(
                        {
                            payMoney: instance.get('amountInputOptions.value'),
                            payPassword: instance.get('payPasswordInputOptions.value')
                        },
                        {
                            preventError: true
                        }
                    )
                    .then(refresh)
                    .always(function (response) {
                        if (response.code === 100010) {
                            alert({
                                title: '温馨提示',
                                content: instance.get('hasPayPassword')
                                       ? '请输入正确的支付密码'
                                       : '你还没有设置支付密码哦'
                            });
                            return;
                        }
                        instance.set('result', response.code === 0 ? 'success' : 'fail');
                    });

                }
            }
        });

        refresh();

    };

});