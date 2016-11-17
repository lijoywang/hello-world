/**
 * @file 提现
 * @author niuxiaojing
 */
define(function (require, exports, module) {

    'use strict';

    var Validator = require('../../../common/custom/form/Validator');
    var isMoney = require('common/validator/isMoney');

    return Ractive.extend({
        template: require('tpl!./Withdraw.html'),
        data: function () {
            return {
                style: require('text!./Withdraw.styl'),
                options: {
                    totalMoney: '',
                    bankLogo: '',
                    cardNumber: '',
                    withdrawMoney: '',
                    password: '',
                    isTianxiao: '',

                    userRole: '',
                    USER_ROLE_STUDENT: '',
                    USER_ROLE_TEACHET: '',
                    USER_ROLE_INSTITUTION: '',

                    back: $.noop,
                    submit: $.noop,
                    getPassword: $.noop,
                    downloadAPP: $.noop,

                },
                withdrawMoneyInputOptions: {
                    name: 'withdrawMoney',
                    value: '',
                    type: 'text'
                },
                passwordInputOptions: {
                    name: 'password',
                    value: '',
                    type: 'password'
                },
                subString: function (str, start, end) {
                    if (end != null) {
                        return str.substr(start);
                    }
                    return str.substr(start, end);
                }

            }
        },
        components: {
            Input: require('../../../common/component/Input')
        },
        oncomplete: function () {
            var me = this;

            me.bindData({
                'withdrawMoneyInputOptions.value': 'options.withdrawMoney',
                'passwordInputOptions.value': 'options.password'
            });
        },
        createValidator: function () {
            var me = this;

            var container = $(me.getElement());
            var totalMoney = me.get('options.totalMoney');

            me.validator = new Validator({
                mainElement: container,
                fields: {
                    withdrawMoney: {
                        rules: {
                            required: true,
                            isMoney: function (data) {
                                return isMoney(data.value);
                            },
                            max: totalMoney,
                            min: 0.01
                        },
                        errors: {
                            required: '请输入提现金额',
                            isMoney: '提现金额格式不正确',
                            max: '账户余额不够提现',
                            min: '最低提现金额0.01元'
                        }
                    },
                    password: {
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
        onteardown: function () {
            if (this.validator) {
                this.validator.dispose();
            }
        },
        validate: function () {
            if (!this.validator) {
                this.createValidator();
            }
            return this.validator.validate();
        },
        back: function () {
            this.get('options.back')();
        },
        submit: function () {
            if (!this.validate()) {
                return;
            }
            this.get('options.submit')();
        },
        getPassword: function () {
            this.get('options.getPassword')();
        },
        downloadAPP: function () {
            this.get('options.downloadAPP')();
        }

    });
});