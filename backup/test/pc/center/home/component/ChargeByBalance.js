/**
 * @file 余额充值
 * @author zhujialu
 */
define(function (require, exports, module) {

    'use strict';

    var formatMoney = require('common/filter/formatMoney');

    var isMoney = require('common/validator/isMoney');
    var isPositiveNumber = require('common/validator/isPositiveNumber');

    var Validator = require('../../../common/custom/form/Validator');

    return Ractive.extend({
        template: require('tpl!./ChargeByBalance.html'),
        data: function () {
            var me = this;
            return {
                style: require('text!./ChargeByBalance.styl'),
                amountInputOptions: {
                    name: 'amount',
                    className: 'amount-input',
                    value: ''
                },
                payPasswordInputOptions: {
                    name: 'payPassword',
                    className: 'pay-password-input',
                    type: 'password',
                    value: ''
                },
                options: {
                    // 账户余额
                    balance: null,
                    // 最低充值金额
                    min: null,
                    // 最高充值金额
                    max: null
                },
                getChargeRangeHint: function () {
                    var list = [];
                    var min = me.get('options.min');
                    var max = me.get('options.max');
                    if (isMoney(min)) {
                        list.push(
                            '最少充值￥' + formatMoney(min)
                        );
                    }
                    if (isMoney(max)) {
                        list.push(
                            '最多充值￥' +  formatMoney(max)
                        );
                    }
                    if (list.length) {
                        return '单次' + list.join('，');
                    }
                }
            };
        },
        components: {
            Input: require('../../../common/component/Input')
        },
        oncomplete: function () {
            var me = this;
            me.validator = new Validator({
                mainElement: $(me.getElement()),
                fields: {
                    amount: {
                        sequence: [
                            'required',
                            'pattern',
                            'min',
                            'max'
                        ],
                        rules: {
                            required: true,
                            pattern: function (data) {
                                return isMoney(data.value)
                                    && isPositiveNumber(data.value);
                            },
                            min: function (data) {
                                var min = me.get('options.min');
                                if (isMoney(min)) {
                                    return data.value >= min;
                                }
                                return true;
                            },
                            max: function (data) {
                                var max = me.get('options.max');
                                if (isMoney(max)) {
                                    return data.value <= max;
                                }
                                return true;
                            }
                        },
                        errors: {
                            required: '请输入充值金额',
                            pattern: '请输入小数点不超过两位的正数金额',
                            min: function () {
                                return '单次最少充值￥' + me.get('options.min');
                            },
                            max: function () {
                                return '单次最大金额为￥' + me.get('options.max');
                            }
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

            me.bindData({
                'amountInputOptions.value': 'options.amount'
            });
        },
        onteardown: function () {
            this.validator.dispose();
        },
        validate: function () {
            return this.validator.validate();
        }
    });

});