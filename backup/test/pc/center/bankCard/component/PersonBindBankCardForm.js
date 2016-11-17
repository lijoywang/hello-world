/**
 * @file 个人帐号绑卡
 * @author zhujialu
 */
define(function (require, exports, module) {

    'use strict';

    var simplifyDate = require('cc/function/simplifyDate');
    var isBankCardNumber = require('common/validator/isBankCardNumber');

    var Validator = require('../../../common/custom/form/Validator');
    var constant = require('../constant');
    var service = require('../service');

    var CODE_BIND_FORCE = 200001;

    function mapPayBankList(data) {
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

    function mapWithdrawBankList(data) {
        return $.map(data, function (item) {
            return {
                text: '<img src="' + item.bank_logo + '">'
                    + '<strong>'
                    +     item.name
                    + '</strong>',
                value: item.bank_code.toUpperCase()
            };
        });
    }

    var creditPayBankList;
    var depositPayBankList;
    var withdrawBankList;

    return Ractive.extend({
        template: require('tpl!./PersonBindBankCardForm.html'),
        data: function () {
            return {
                style: require('text!./PersonBindBankCardForm.styl'),

                bankCardType: constant.BANK_CARD_TYPE_DEPOSITS,

                BIND_TYPE_NEW_PAY: constant.BIND_TYPE_NEW_PAY,
                BIND_TYPE_NEW_WITHDRAW: constant.BIND_TYPE_NEW_WITHDRAW,
                BIND_TYPE_EDIT_WITHDRAW: constant.BIND_TYPE_EDIT_WITHDRAW,

                BANK_CARD_TYPE_CREDIT: constant.BANK_CARD_TYPE_CREDIT,
                BANK_CARD_TYPE_DEPOSITS: constant.BANK_CARD_TYPE_DEPOSITS,

                userNameInputOptions: {
                    name: 'userName',
                    value: '',
                    className: 'user-name-input'
                },
                userIdInputOptions: {
                    name: 'userId',
                    value: '',
                    className: 'user-id-input'
                },
                userMobileInputOptions: {
                    name: 'userMobile',
                    value: '',
                    className: 'user-mobile-input'
                },
                bankCardNumberInputOptions: {
                    name: 'bankCardNumber',
                    value: '',
                    className: 'bank-card-input'
                },
                bankSelectOptions: {
                    name: 'bank',
                    data: [],
                    value: '',
                    defaultText: '请选择',
                    className: 'bank-select'
                },
                cvvInputOptions: {
                    name: 'cvv',
                    value: '',
                    className: 'cvv-input'
                },
                expireDateSelectOptions: {
                    className: 'expire-date-select',
                    sofar: false,
                    year: {
                        name: 'expireYear',
                        max: simplifyDate(new Date()).year + 20,
                        value: '',
                        defaultText: '请选择'
                    },
                    month: {
                        name: 'expireMonth',
                        value: '',
                        defaultText: '请选择'
                    },
                },
                verifyCodeInputOptions: {
                    name: 'verifyCode',
                    value: '',
                    className: 'verify-code-input'
                },
                bankLocationOptions: {
                    className: 'bank-location',
                    province: {
                        name: 'province',
                        value: '',
                        defaultText: '省'
                    },
                    city: {
                        name: 'city',
                        value: '',
                        defaultText: '市'
                    }
                },
                codeButtonOptions: {
                    text: '获取验证码',
                    className: 'code-button',
                    disabled: false,
                    countdown: false,
                    countdownText: '${second}秒后可再次发送',
                    countdownSecond: 60
                },
                options: {
                    canBindForce: false,
                    userNameReadOnly: false,
                    userIdReadOnly: false,
                    bindType: '',
                    userName: '',
                    userId: '',
                    userMobile: '',
                    bankCardNumber: '',
                    bankLocation: {
                        province: '',
                        city: ''
                    },
                    verifyCode: ''
                }
            };
        },
        components: {
            Input: require('../../../common/component/Input'),
            Select: require('../../../common/component/Select'),
            AddressSelect: require('../../../common/component/AddressSelect'),
            DateSelect: require('../../../common/component/DateSelect'),
            CodeButton: require('../../../common/component/CodeButton')
        },
        oncomplete: function () {

            var me = this;

            var container = $(me.getElement());

            me.validator = new Validator({
                mainElement: container,
                fields: {
                    userName: {
                        rules: {
                            required: true,
                            pattern: 'char'
                        },
                        errors: {
                            required: '请输入姓名',
                            pattern: '请输入正确的格式'
                        }
                    },
                    userId: {
                        rules: {
                            required: true,
                            pattern: /(?:\w|\*)+/
                        },
                        errors: {
                            required: '请输入身份证',
                            pattern: '请输入正确的格式'
                        }
                    },
                    userMobile: {
                        rules: {
                            required: true,
                            pattern: 'mobile'
                        },
                        errors: {
                            required: '请输入手机号',
                            pattern: '请输入正确的格式'
                        }
                    },
                    bankCardNumber: {
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
                    cvv: {
                        rules: {
                            required: true,
                            pattern: /^\d{3}$/
                        },
                        errors: {
                            required: '请输入卡验证码',
                            pattern: '卡验证码格式错误'
                        }
                    },
                    expireYear: {
                        rules: {
                            required: true,
                        },
                        errors: {
                            required: '请选择年份'
                        }
                    },
                    expireMonth: {
                        before: function (data) {
                            var year = data.expireYear.value;
                            if (!year || year == constant.YEAR_SOFAR) {
                                return false;
                            }
                        },
                        rules: {
                            required: true,
                        },
                        errors: {
                            required: '请选择月份'
                        }
                    },
                    verifyCode: {
                        rules: {
                            required: function () {
                                return me.get('options.needBindForce') ? false : true;
                            }
                        },
                        errors: {
                            required: '请输入手机验证码'
                        }
                    },
                    province: {
                        rules: {
                            required: true,
                        },
                        errors: {
                            required: '请选择省份'
                        }
                    },
                    city: {
                        before: function (data) {
                            if (!data.province.value) {
                                return false;
                            }
                        },
                        rules: {
                            required: true,
                        },
                        errors: {
                            required: '请选择城市'
                        }
                    }
                }
            });

            me.bindData({
                'userNameInputOptions.value': 'options.userName',
                'userIdInputOptions.value': 'options.userId',
                'userMobileInputOptions.value': 'options.userMobile',
                'bankSelectOptions.value': 'options.bankNumber',
                'bankCardNumberInputOptions.value': 'options.bankCardNumber',
                'verifyCodeInputOptions.value': 'options.verifyCode',
                'bankLocationOptions.province.value': 'options.bankLocation.province',
                'bankLocationOptions.city.value': 'options.bankLocation.city'
            });

            me.on('CodeButton.click', function () {
                var fields = [
                    'userName', 'userId',
                    'userMobile', 'bankCardNumber',
                    'cvv', 'expireYear', 'expireMonth',
                    'province', 'city'
                ];
                if (me.validate(fields)) {
                    me.set('codeButtonOptions.disabled', true);

                    service
                    .bindBankCardBySms(
                        {
                            userName: me.get('userNameInputOptions.value'),
                            userId: me.get('userIdInputOptions.value'),
                            userMobile: me.get('userMobileInputOptions.value'),
                            bankCardNumber: me.get('bankCardNumberInputOptions.value'),
                            cvv: me.get('cvvInputOptions.value'),
                            expireYear: me.get('expireDateSelectOptions.year.value'),
                            expireMonth: me.get('expireDateSelectOptions.month.value'),
                            bankNumber: me.get('bankSelectOptions.value'),
                            bankCardType: me.get('bankCardType'),
                            bindType: me.get('options.bindType'),
                            province: me.get('bankLocationOptions.province.value'),
                            city: me.get('bankLocationOptions.city.value')
                        },
                        {
                            preventError: true
                        }
                    )
                    .always(function (response) {
                        var data = {
                            'options.token': '',
                            'options.needBindForce': false,
                        };
                        if (!response.code) {
                            data['options.token'] = response.data.token;
                            data['codeButtonOptions.countdown'] = 60;
                        }
                        else {
                            data['codeButtonOptions.disabled'] = false;
                            if (response.code == CODE_BIND_FORCE
                                && me.get('options.canBindForce')
                            ) {
                                data['options.needBindForce'] = true;
                            }
                            else if (response.msg) {
                                alert({
                                    title: '提示',
                                    content: response.msg
                                });
                            }
                        }
                        me.set(data);
                    });
                }
            });

            me.observe('bankCardNumberInputOptions.blur', function (blur) {
                var bankCardNumber = $.trim(
                    me.get('bankCardNumberInputOptions.value')
                );
                if (blur && bankCardNumber) {
                    service
                    .getBankCardSuggestion({
                        bankCardNumber: bankCardNumber
                    })
                    .done(function (response) {
                        if (!response.code) {
                            var data = response.data;
                            me.set({
                                'bankSelectOptions.value': data.bank_code.toUpperCase(),
                                'bankSelectOptions.disabled': true,
                                bankCardType: data.card_type
                            });
                        }
                    });
                }
            });

            var updateBankList = function () {
                var bindType = me.get('options.bindType');
                var bankCardType = me.get('bankCardType');
                var bankNumber = me.get('bankSelectOptions.value');
                var bankList;

                if (bindType == constant.BIND_TYPE_NEW_PAY) {
                    if (bankCardType == constant.BANK_CARD_TYPE_CREDIT) {
                        bankList = creditPayBankList;
                    }
                    else if (bankCardType == constant.BANK_CARD_TYPE_DEPOSITS) {
                        bankList = depositPayBankList;
                    }
                }
                else {
                    bankList = withdrawBankList;
                }

                if (bankList) {
                    var matchs = $.grep(bankList, function (item) {
                        return item.value === bankNumber;
                    });
                    me.set({
                        'bankSelectOptions.data': bankList,
                        'bankSelectOptions.value': matchs.length > 0 ? bankNumber : ''
                    });
                }
            };

            me.observe('bankCardType', updateBankList);

            me.observe('options.bindType', function (bindType) {
                if (bindType == constant.BIND_TYPE_NEW_PAY) {
                    if (!creditPayBankList || !depositPayBankList) {
                        service.getSupportedPayBankList()
                        .then(function (response) {
                            var data = response.data;
                            creditPayBankList = mapPayBankList(data.credit_card_list);
                            depositPayBankList = mapPayBankList(data.deposit_card_list);
                            updateBankList();
                        });
                    }
                }
                else if (bindType == constant.BIND_TYPE_NEW_WITHDRAW
                    || bindType == constant.BIND_TYPE_EDIT_WITHDRAW
                ) {
                    if (!withdrawBankList) {
                        service.getSupportedWithdrawBankList()
                        .then(function (response) {
                            withdrawBankList = mapWithdrawBankList(response.data);
                            updateBankList();
                        });
                    }
                }
            });

        },
        onteardown: function () {
            this.validator.dispose();
        },
        validate: function (fields) {
            return this.validator.validate(fields);
        }
    });

});