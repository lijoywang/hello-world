/**
 * @file 余额信息组件
 * @author niuxiaojing
 */
define(function (require, exports, module) {

    'use strict';

    var isBankCardNumber = require('common/validator/isBankCardNumber');
    var isMobile = require('common/validator/isMobile');
    var isNumber = require('common/validator/isNumber');
    var service = require('../service');

    var Validator = require('../../../common/custom/form/Validator');

    function mapWithdrawBankList(data) {
        return $.map(data, function (item) {
            return {
                text: '<img src="' + item.bank_logo + '">'
                + '<strong>'
                +     item.bank_name
                + '</strong>',
                value: item.bank_no.toUpperCase()
            };
        });
    }

    return Ractive.extend({
        template: require('tpl!./CreateNewCard.html'),
        data: function () {
            var me = this;

            return {
                style: require('text!./CreateNewCard.styl'),
                options: {
                    money: '',
                    complete: $.noop,
                    back: $.noop
                },

                cardInputOptions: {
                    name: 'card',
                    value: ''
                },
                bankSelectOptions: {
                    name: 'bank',
                    data: [],
                    value: '',
                    defaultText: '请选择',
                    className: 'bank-select'
                },
                nameInputOptions: {
                    name: 'name',
                    value: ''
                },
                identityInputOptions: {
                    name: 'identity',
                    value: ''
                },
                mobileInputOptions: {
                    name: 'mobile',
                    value: ''
                },
                codeInputOptions: {
                    name: 'code',
                    value: '',
                    className: 'code'
                },
                codeButtonOptions: {
                    text: '发送验证码',
                    className: 'code-button',
                    disabled: false,
                    countdown: false,
                    countdownText: '${second}秒后可再次发送',
                    countdownSecond: 60
                },
                ChargeSuccessOptions: {
                    seconds: 3,
                    buttonText: '前往首页',
                    onComplete: function () {
                        var complete = me.get('options.complete');
                        if ($.isFunction(complete)) {
                            complete();
                        }
                    }
                },

                checked: true,
                submiting: false,
                chargeSuccess: false,

                payParams: { }
            }
        },
        components: {
            Input: require('../../../common/component/Input'),
            CodeButton: require('../../../common/component/CodeButton'),
            ChargeSuccess: require('./ChargeSuccess'),
            Select: require('../../../common/component/Select')
        },
        oncomplete: function () {
            var me = this;
            me.validator = new Validator({
                mainElement: $(me.getElement()),
                fields: {
                    name: {
                        rules: {
                            required: true,
                            pattern: 'char'
                        },
                        errors: {
                            required: '请输入企业开户名称',
                            pattern: '请输入正确的格式'
                        }
                    },
                    card: {
                        rules: {
                            required: true,
                            pattern: function (data) {
                                return isBankCardNumber(data.value);
                            }
                        },
                        errors: {
                            required: '请输入银行卡号',
                            pattern: '银行卡号格式错误'
                        }
                    },
                    bank: {
                        rules: {
                            required: true
                        },
                        errors: {
                            required: '请选择银行'
                        }
                    },
                    mobile: {
                        rules: {
                            required: true,
                            pattern: function (data) {
                                return isMobile(data.value);
                            }
                        },
                        errors: {
                            required: '请输入手机号',
                            pattern: '手机号格式错误'
                        }
                    },
                    code: {
                        rules: {
                            required: true,
                            pattern: function (data) {
                                return isNumber(data.value);
                            }
                        },
                        errors: {
                            required: '请输入短信验证码',
                            pattern: '短信验证码格式错误'
                        }
                    },
                    identity: {
                        rules: {
                            required: true,
                            pattern: function (data) {
                                return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(data.value);
                            }
                        },
                        errors: {
                            required: '请输入身份证号',
                            pattern: '身份证号格式有误'
                        }
                    }
                }
            });

            service.getRechargeBankList()
            .then(function (response) {
                me.set({
                    'bankSelectOptions.data': mapWithdrawBankList(response.data)
                });
            });
        },
        sendCode: function () {
            var me = this;
            if (me.validator.validate([
                    'name',
                    'card',
                    'bank',
                    'mobile',
                    'identity'
                ])
            ) {
                service
                .sendCode({
                    money: me.get('options.money'),
                    owner_name: me.get('nameInputOptions.value'),
                    owner_id: me.get('identityInputOptions.value'),
                    owner_mobile: me.get('mobileInputOptions.value'),
                    unique_id: me.get('cardInputOptions.value'),
                    card_name: me.get('bankSelectOptions.value'),
                    cash_type: 2
                })
                .then(function (response) {
                    me.set({
                        'codeButtonOptions.countdown': true,
                        'payParams': response.data
                    });
                });
            }
        },
        submitCompanyBindBankCardForm: function () {
            var me = this;

            if (me.validator.validate() && me.get('checked')) {
                var payParams = me.get('payParams');
                if (!$.isEmptyObject(payParams)) {
                    me.set('submiting', true);
                    service.rechargePay(
                        $.extend(
                            payParams,
                            {
                                owner_name: me.get('nameInputOptions.value'),
                                owner_id: me.get('identityInputOptions.value'),
                                owner_mobile: me.get('mobileInputOptions.value'),
                                unique_id: me.get('cardInputOptions.value'),
                                card_name: me.get('bankSelectOptions.value'),
                                cash_type: 2,
                                trade_code: me.get('codeInputOptions.value')
                            }
                        )
                    )
                    .then(function (response) {
                        me.set('chargeSuccess', true);
                    })
                    .always(function () {
                        me.set('submiting', false);
                    });
                }
                else {
                    tip({
                        content:'未获取验证码，请发送验证码',
                        type: 'error'
                    });
                }
            }
        }
    });
});