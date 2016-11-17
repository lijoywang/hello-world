/**
 * @file 输入支付密码
 * @author zhujialu
 */
define(function (require, exports, module) {

    'use strict';

    var Validator = require('../../common/custom/form/Validator');
    var ractiveDialog = require('../../common/function/ractiveDialog');
    var homeService = require('../home/service');

    var ResetPayPasswordForm = require('./ResetPayPasswordForm');

    return Ractive.extend({
        template: require('tpl!./PayPasswordInputForm.html'),
        data: function () {
            return {
                style: require('text!./PayPasswordInputForm.styl'),
                payPasswordInputOptions: {
                    name: 'payPassword',
                    value: '',
                    type: 'password',
                    className: 'pay-password-input'
                },
                options: {
                    submit: $.noop
                }
            };
        },
        components: {
            Input: require('../../common/component/Input')
        },
        oncomplete: function () {

            var me = this;

            var container = $(me.el);

            me.validator = new Validator({
                mainElement: container,
                fields: {
                    payPassword: {
                        rules: {
                            required: true,
                            pattern: /^\d{6}$/
                        },
                        errors: {
                            required: '请输入支付密码',
                            pattern: '支付密码必须是6位数字'
                        }
                    }
                }
            });

        },
        onteardown: function () {
            this.validator.dispose();
        },
        validate: function () {
            return this.validator.validate();
        },
        forgetPayPassword: function () {
            var dialog = ractiveDialog(
                ResetPayPasswordForm,
                {
                    title: '修改支付密码',
                    width: 540
                },
                {
                    mobile: userData.mobile,
                    sendVerifyCode: function () {
                        return homeService
                        .sendVerifyCode();
                    },
                    onNext: function (data) {
                        return homeService
                        .checkSms(data);
                    },
                    submit: function (data) {
                        return homeService
                        .resetPassword(data);
                    },
                    onSuccess: function () {
                        dialog.dispose();
                    }
                }
            );
        },
        submit: function () {
            var me = this;
            if (me.validate()) {
                var payPassword = me.get('payPasswordInputOptions.value');
                var submit = me.get('options.submit');
                if ($.isFunction(submit)) {
                    submit({
                        payPassword: payPassword
                    });
                }
            }
        }
    });

});