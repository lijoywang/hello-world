/**
 * @file 提现申请对话框
 * @author zhujialu
 */
define(function (require, exports, module) {

    'use strict';

    var ractiveDialog = require('../../common/function/ractiveDialog');
    var Validator = require('../../common/custom/form/Validator');
    var service = require('../service');

    function WithdrawRequestDialog(options) {
        $.extend(this, options);
        this.init();
    }

    var proto = WithdrawRequestDialog.prototype;

    proto.init = function () {

        var me = this;
        var leagueId = me.leagueId;

        var dialog = ractiveDialog({
            template: require('tpl!./WithdrawRequestDialog.html'),
            data: {
                style: require('text!./WithdrawRequestDialog.styl'),
                mobile: '',
                inputOptions: {
                    name: 'code',
                    value: '',
                    placeholder: '输入验证码',
                    className: 'code-input'
                },
                codeButtonOptions: {
                    text: '发送验证码',
                    className: 'code-button',
                    disabled: false,
                    countdown: false,
                    countdownText: '${second} 秒后可再次发送',
                    countdownSecond: 60
                }
            },
            oninit: function () {

                var me = this;

                service
                .getUserInfo({
                    leagueId: leagueId
                })
                .then(function (response) {
                    me.set('mobile', response.data.mobile);
                });

            },
            onrender: function () {

                var me = this;

                me.on('sendCode', function () {

                    me.set('codeButtonOptions.disabled', true);

                    service
                    .verifyMobile({
                        leagueId: leagueId
                    })
                    .then(
                        function (response) {
                            me.set('codeButtonOptions.countdown', true);
                        },
                        function (response) {
                            me.set('codeButtonOptions.disabled', false);
                        }
                    );

                });

            },
            withdrawRequest: function () {
                if (validator.validate()) {
                    service
                    .checkMobile({
                        leagueId: leagueId,
                        code: this.get('inputOptions.value')
                    })
                    .then(function () {
                        dialog.hide();
                        if ($.isFunction(me.onsuccess)) {
                            me.onsuccess();
                        }
                    });
                }
            },
            components: {
                Input: require('../../common/component/Input'),
                CodeButton: require('../../common/component/CodeButton')
            }
        });

        var validator = new Validator({
            mainElement: dialog.find('.body'),
            fields: {
                code: {
                    rules: {
                        required: true
                    },
                    errors: {
                        required: '请输入验证码'
                    }
                }
            }
        });

        dialog.show();

    };

    return WithdrawRequestDialog;

});