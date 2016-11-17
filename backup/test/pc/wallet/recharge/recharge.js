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

    var isMoney = require('common/validator/isMoney');
    var isPositiveNumber = require('common/validator/isPositiveNumber');

    var tabIndex2PayChannel = {
        '0': 1,
        '1': 2,
        '2': 3
    };

    var RECHARGE_MIN = 1000;
    var RECHARGE_MAX = 50 * 10000;

    exports.init = function () {

        var refresh = function (response) {
            service
            .getWalletBalance()
            .then(function (response) {
                var data = response.data;
                instance.set({
                    promotionAmount: toNumber(data.balance, 0),
                    walletBalance: toNumber(data.normal_balance, 0),
                    hasPayPassword: data.has_password
                });
            });
            return response;
        };

        var instance = new Ractive({
            el: '#container',
            template: require('tpl!./recharge.html'),
            data: {
                tabIndex: 0,
                promotionAmount: 0,
                walletBalance: 0,
                bankList: [ ],
                bankCode: '',
                hasPayPassword: false,
                orgNumber: siteData.orgNumber,
                orgHost: siteData.orgHost,
                result: '',
                rechargeInputOptions: {
                    name: 'recharge',
                    className: 'recharge-input',
                    value: ''
                },
                payPasswordInputOptions: {
                    name: 'payPassword',
                    className: 'pay-password-input',
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
                        recharge: {
                            sequence: [
                                'required',
                                'positive',
                                'money',
                                'min',
                                'lessThanBalance',
                                'lessThanMax'
                            ],
                            rules: {
                                required: true,
                                positive: function (data) {
                                    return isPositiveNumber(data.value);
                                },
                                money: function (data) {
                                    return isMoney(data.value);
                                },
                                min: function (data) {
                                    if (instance.get('tabIndex') !== 2) {
                                        return data.value >= RECHARGE_MIN;
                                    }
                                    return true;
                                },
                                lessThanBalance: function (data) {
                                    if (instance.get('tabIndex') === 2) {
                                        return data.value <= instance.get('walletBalance');
                                    }
                                    return true;
                                },
                                lessThanMax: function (data) {
                                    if (instance.get('tabIndex') === 2) {
                                        return data.value <= RECHARGE_MAX;
                                    }
                                    return true;
                                }
                            },
                            errors: {
                                required: '请输入充值金额',
                                positive: '请输入正数',
                                money: '小数点不能超过两位',
                                min: '单次最少充值￥' + RECHARGE_MIN + '，使用钱包余额充值没有最低限额',
                                lessThanBalance: '充值金额大于钱包余额',
                                lessThanMax: '单次充值最大金额为50万元人民币'
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

                    var bankCode = instance.get('bankCode');
                    var tabIndex = instance.get('tabIndex');

                    if (!bankCode && tabIndex < 2) {
                        alert({
                            title: '提示',
                            content: '请选择一种支付方式'
                        });
                        return;
                    }

                    var data = {
                        payMoney: instance.get('rechargeInputOptions.value'),
                        payChannel: tabIndex2PayChannel[tabIndex]
                    };

                    if (tabIndex < 2) {
                        data.payType = 24;
                        data.bankNo = bankCode;
                    }
                    else {
                        data.payPassword = instance.get('payPasswordInputOptions.value');
                    }

                    service
                    .recharge(data, { sync: true, preventError: true })
                    .always(function (response) {
                        if (!response.code) {
                            var data = response.data;
                            if (data && $.type(data.pay_url) === 'string') {
                                window.open(data.pay_url);
                                alert({
                                    title: '温馨提示',
                                    content: '请在新打开的页面进行支付，支付完成前请不要关闭该窗口',
                                    buttons: [
                                        {
                                            text: '已完成支付',
                                            type: 'primary',
                                            action: function () {
                                                refresh();

                                                service
                                                .getRechargeStatus({
                                                    purchaseId: data.purchase_id
                                                })
                                                .then(function (response) {
                                                    instance.set('result', response.data.status == 0 ? 'fail' : 'success');
                                                });

                                                this.hide();
                                            }
                                        },
                                        {
                                            text: '支付遇到问题',
                                            type: 'secondary',
                                            action: function () {
                                                instance.set('result', 'fail');
                                                widnow.open(
                                                    'https://www.genshuixue.com/guide/pay?a=pay'
                                                );
                                                this.hide();
                                            }
                                        }
                                    ]
                                })
                                return;
                            }
                        }
                        // 密码错误
                        else if (response.code === 100010) {
                            alert({
                                title: '温馨提示',
                                content: instance.get('hasPayPassword')
                                       ? '请输入正确的支付密码'
                                       : '你还没有设置支付密码哦'
                            });
                            return;
                        }
                        if (response.code === 0) {
                            refresh();
                            instance.set('result', 'success');
                        }
                        else {
                            instance.set('result', 'fail');
                        }
                    });

                }
            }
        });

        refresh();

        service
        .getWalletBankList()
        .then(function (response) {
            var list = response.data.list;
            instance.set({
                bankList: list,
                bankCode: list[0].code
            });
        });

    };

});