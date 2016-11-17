/**
 * @file 重置支付密码
 * @author zhujialu
 */
define(function (require, exports, module) {

    'use strict';

    var toString = require('cc/function/toString');
    var Validator = require('../../common/custom/form/Validator');

    return Ractive.extend({
        template: require('tpl!./ResetPayPasswordForm.html'),
        data: function () {
            return {
                style: require('text!./ResetPayPasswordForm.styl'),

                code: '',
                submiting: false,

                codeInputOptions: {
                    name: 'code',
                    value: '',
                    className: 'code-input',
                    placeholder: '请输入校验码'
                },
                codeButtonOptions: {
                    text: '获取校验码',
                    className: 'code-button',
                    disabled: false,
                    countdown: false,
                    countdownText: '${second}秒后可再次发送',
                    countdownSecond: 60
                },

                payPasswordInputOptions: {
                    name: 'payPassword',
                    value: '',
                    type: 'password',
                    className: 'pay-password-input',
                    placeholder: '请输入新密码'
                },
                confirmPayPasswordInputOptions: {
                    name: 'confirmPayPassword',
                    value: '',
                    type: 'password',
                    className: 'confirm-pay-password-input',
                    placeholder: '请再次输入新密码'
                },

                options: {
                    mobile: '',
                    sendVerifyCode: $.noop,
                    submit: $.noop,
                    onSuccess: $.noop,
                    onNext: $.noop
                }
            }
        },
        components: {
            Input: require('../../common/component/Input'),
            CodeButton: require('../../common/component/CodeButton')
        },
        oncomplete: function () {
            var me = this;

            me.validator = new Validator({
                mainElement: $(me.getElement()),
                fields: {
                    code: {
                        rules: {
                            required: true,
                            pattern: /^\d{6}$/
                        },
                        errors: {
                            required: '请输入校验码',
                            pattern: '请输入6位数字的校验码'
                        }
                    },
                    payPassword: {
                        rules: {
                            required: true,
                            pattern: /^\d{6}$/
                        },
                        errors: {
                            required: '请输入新密码',
                            pattern: '请输入6位数字的支付密码'
                        }
                    },
                    confirmPayPassword: {
                        rules: {
                            required: true,
                            equals: 'payPassword'
                        },
                        errors: {
                            required: '请再次输入新密码',
                            equals: '两次输入的密码不相同'
                        }
                    }
                }
            });

            me.on('CodeButton.click', function () {
                me.set('codeButtonOptions.disabled', true);

                var sendVerifyCode = me.get('options.sendVerifyCode')
                sendVerifyCode()
                .then(
                    function () {
                        me.set({
                            'codeButtonOptions.countdown': 60
                        });
                    },
                    function () {
                        me.set({
                            'codeButtonOptions.disabled': false
                        });
                    }
                );
            });
        },
        onteardown: function () {
            this.validator.dispose();
        },
        next: function () {
            var me = this;
            if (me.validator.validate()) {
                var code = $.trim(me.get('codeInputOptions.value'));
                var onNext = me.get('options.onNext');

                me.set('submiting', true);

                onNext({
                    code: code
                })
                .then(
                    function () {
                        me.set({
                            'submiting': false,
                            'code': code
                        })
                    },
                    function () {
                        me.set('submiting', false);
                    }
                )
            }
        },
        submit: function () {
            var me = this;
            if (me.validator.validate()) {

                var code = me.get('code');
                var payPassword = me.get('payPasswordInputOptions.value');

                var submit = me.get('options.submit');

                me.set('submiting', true);

                submit({
                    code: code,
                    payPassword: payPassword
                })
                .then(
                    function () {
                        me.set('submiting', false);
                        var onSuccess = me.get('options.onSuccess');
                        onSuccess();
                    },
                    function () {
                        me.set('submiting', false);
                    }
                );
            }
        }
    });
});
