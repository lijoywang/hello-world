/**
 * @file 企业帐号绑卡
 * @author zhujialu
 */
define(function (require, exports, module) {

    'use strict';

    var isBankCardNumber = require('common/validator/isBankCardNumber');

    var Validator = require('../../../common/custom/form/Validator');
    var constant = require('../constant');
    var service = require('../service');

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
        template: require('tpl!./CompanyBindBankCardForm.html'),
        data: function () {
            return {
                style: require('text!./CompanyBindBankCardForm.styl'),

                bankCardType: constant.BANK_CARD_TYPE_DEPOSITS,

                BIND_TYPE_NEW_PAY: constant.BIND_TYPE_NEW_PAY,
                BIND_TYPE_NEW_WITHDRAW: constant.BIND_TYPE_NEW_WITHDRAW,
                BIND_TYPE_EDIT_WITHDRAW: constant.BIND_TYPE_EDIT_WITHDRAW,

                BANK_CARD_TYPE_CREDIT: constant.BANK_CARD_TYPE_CREDIT,
                BANK_CARD_TYPE_DEPOSITS: constant.BANK_CARD_TYPE_DEPOSITS,

                companyNameInputOptions: {
                    name: 'companyName',
                    value: '',
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
                options: {
                    bindType: '',
                    companyName: '',
                    bankNumber: '',
                    bankCardNumber: '',
                    bankLocation: {
                        province: '',
                        city: ''
                    }
                }
            };
        },
        components: {
            Input: require('../../../common/component/Input'),
            Select: require('../../../common/component/Select'),
            AddressSelect: require('../../../common/component/AddressSelect')
        },
        oncomplete: function () {

            var me = this;

            var container = $(me.getElement());

            me.validator = new Validator({
                mainElement: container,
                fields: {
                    companyName: {
                        rules: {
                            required: true,
                            pattern: 'char'
                        },
                        errors: {
                            required: '请输入企业开户名称',
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
                'bankSelectOptions.value': 'options.bankNumber',
                'companyNameInputOptions.value': 'options.companyName',
                'bankCardNumberInputOptions.value': 'options.bankCardNumber',
                'bankLocationOptions.province.value': 'options.bankLocation.province',
                'bankLocationOptions.city.value': 'options.bankLocation.city'
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
        validate: function () {
            return this.validator.validate();
        }
    });

});