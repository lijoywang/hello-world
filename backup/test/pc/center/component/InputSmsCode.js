/**
 * @file 输入验证码
 * @author niuxiaojing
 */
define(function (require, exports, module) {

    'use strict';

    var toString = require('cc/function/toString');
    var Validator = require('../../common/custom/form/Validator');

    return Ractive.extend({
        template: require('tpl!./InputSmsCode.html'),
        data: function () {
            return {
                style: require('text!./InputSmsCode.styl'),
                code: '',
                submiting: false,

                codeInputOptions: {
                    name: 'code',
                    value: '',
                    className: 'code-input',
                    placeholder: '请输入验证码'
                },
                codeButtonOptions: {
                    text: '获取校验码',
                    className: 'code-button',
                    disabled: false,
                    countdown: false,
                    countdownText: '${second}秒后可再次发送',
                    countdownSecond: 60
                },



                options: {
                    mobile: '',
                    buttonName: '',
                    sendVerifyCode: $.noop,
                    sendVoiceCode: $.noop,
                    submit: $.noop,
                    onSuccess: $.noop,
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
                            pattern: /^\d+$/
                        },
                        errors: {
                            required: '请输入校验码',
                            pattern: '请输入数字校验码'
                        }
                    },

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
        showVoiceButton: function () {
            var me = this;
            confirm({
                title: '获取语音验证码',
                content: '语音验证码将以电话形式通知您，请注意接听',
                removeClose: false,
                buttons: [
                    {
                        text: '获取',
                        type: 'primary',
                        action: function () {
                            this.hide();
                            var sendVoiceCode = me.get('options.sendVoiceCode')
                            sendVoiceCode();
                        }
                    },
                    {
                        text: '取消',
                        type: 'muted',
                        action: function () {
                            this.hide();
                        }
                    }
                ]
            });
        },
        submit: function () {
            var me = this;
            if (me.validator.validate()) {

                var code = $.trim(me.get('codeInputOptions.value'));

                var submit = me.get('options.submit');

                me.set('submiting', true);

                submit({
                    code: code
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
