/**
 * @file 网银充值
 * @author zhujialu
 */
define(function (require, exports, module) {

    'use strict';

    var formatMoney = require('common/filter/formatMoney');

    var isInt = require('common/validator/isInt');
    var isMoney = require('common/validator/isMoney');
    var isPositiveNumber = require('common/validator/isPositiveNumber');

    var ractiveDialog = require('../../../common/function/ractiveDialog');
    var service = require('../service');

    var Validator = require('../../../common/custom/form/Validator');

    return Ractive.extend({
        template: require('tpl!./ChargeByEbank.html'),
        data: function () {
            var me = this;
            return {
                style: require('text!./ChargeByEbank.styl'),

                options: {
                    balance: '',
                    min: '',
                    max: '',
                    back: $.noop
                },

                amountInputOptions: {
                    name: 'amount',
                    className: 'amount-input',
                    value: ''
                },
                bankInfoOptions: {
                    name: 'bank',
                    data: [],
                    value: ''
                },
                codeInputOptions: {
                    name: 'noteVerify',
                    value: '',
                    placeholder: '请输入短信验证码',
                    className: 'code-input',
                    type: 'text'
                },
                codeButtonOptions: {
                    text: '发送验证码',
                    className: 'code-button',
                    disabled: false,
                    countdown: false,
                    countdownText: '${second}秒后可再次发送',
                    countdownSecond: 60
                },
                bankInfoItem: { },
                payParams: { }
            };
        },
        components: {
            Input: require('../../../common/component/Input'),
            CodeButton: require('../../../common/component/CodeButton'),
            BankInfo: require('../../../checkout/component/BankInfo')
        },
        oncomplete: function () {
            var me = this;
            me.validator = new Validator({
                mainElement: $(me.getElement()),
                fields: {
                    amount: {
                        sequence: [
                            'required',
                            'pattern'
                        ],
                        rules: {
                            required: true,
                            pattern: function (data) {
                                var value = data.value;
                                return  isMoney(value) && value > 0;
                            }
                        },
                        errors: {
                            required: '请输入充值金额',
                            pattern: '请输入小数点不超过两位的正数金额'
                        }
                    },
                    noteVerify: {
                        rules: {
                            required: true,
                            pattern: function (data) {
                                return isInt(data.value);
                            }
                        },
                        errors: {
                            required: '短信验证码不能为空',
                            pattern: '请输入正确的短信验证码'
                        }
                    }
                }
            });

            me.observe('bankInfoOptions.value', function (value) {
                var me = this;
                if (value !== '') {
                    var listItem = me.get('bankInfoOptions.data.' + value);
                    if (listItem) {
                        me.set('bankInfoItem', listItem);
                    }
                }
            });

            me.observe('amountInputOptions.value', function () {
                me.set({
                    'payParams': {},
                    'codeButtonOptions.countdown': false
                });
            });

            // 请求银行列表
            service.getRechargeBankCard()
            .then(function (response) {
                var card_info = response.data.card_info;
                if (card_info) {
                    var data = {
                        'bankInfoOptions.data': card_info,
                        'bankInfoOptions.value': 0
                    };

                    me.set(data);
                }
            });
        },
        onteardown: function () {
            this.validator.dispose();
        },
        sendCode: function () {
            var me = this;

            if (me.validator.validate('amount')) {
                service
                .sendCode({
                    money: me.get('amountInputOptions.value'),
                    owner_mobile: me.get('bankInfoItem.owner_mobile'),
                    card_name: me.get('bankInfoItem.card_name'),
                    unique_id: me.get('bankInfoItem.unique_id'),
                    cash_type: 5
                })
                .then(function (response) {
                    me.set({
                        'codeButtonOptions.countdown': true,
                        'payParams': response.data
                    });
                });
            }
        },
        newCard: function () {
            var me = this;
            if (this.validator.validate('amount')) {
                var money = me.get('amountInputOptions.value');
                var title = '支付 <span class="text warning">￥'
                    + money
                    + '</span>';

                var dialog = ractiveDialog(
                    require('./CreateNewCard'),
                    {
                        title: title,
                        width: 520
                    },
                    {
                        back: me.get('back'),
                        money: money,
                        complete: function () {
                            dialog.hide();

                            var backFun = me.get('options.back');
                            if ($.isFunction(backFun)) {
                                backFun();
                            }
                        }
                    }
                );
            }
        }
    });

});