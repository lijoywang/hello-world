/**
 * @file 充值
 * @author zhujialu
 */
define(function (require, exports, module) {

    'use strict';

    var service = require('../service');

    return Ractive.extend({
        template: require('tpl!./Charge.html'),
        data: function () {
            var me = this;

            return {
                style: require('text!./Charge.styl'),

                options: {
                    chargeByPersonEbankOptions: {
                        balance: 1000,
                        min: 20,
                        max: 200,
                        submit: $.noop,
                        back: $.noop
                    },
                    onReady: $.noop
                },

                chargeSuccessOptions: {
                    seconds: 3,
                    buttonText: '前往首页',
                    onComplete: function () {
                        var backFun = me.get('options.chargeByPersonEbankOptions.back');
                        if ($.isFunction(backFun)) {
                            backFun();
                        }

                    }
                },

                submiting: true,
                chargeSuccess: false
            };
        },
        components: {
            ChargeByEbank: require('./ChargeByEbank'),
            ChargeSuccess: require('./ChargeSuccess')
        },
        oncomplete: function () {
            var me = this;
            var component = me.findComponent('ChargeByEbank');

            component.observe('bankInfoOptions.data', function (data) {
                if (data && data.length) {
                    me.set('submiting', false);
                }
            });
        },
        submit: function () {
            var me = this;

            var component = me.findComponent('ChargeByEbank');

            if (component && component.validator.validate()) {
                var params = component.get('payParams');

                if (!$.isEmptyObject(params)) {
                    me.set('submiting', true);

                    service.rechargePay(
                        $.extend(
                            params,
                            {
                                trade_code: component.get('codeInputOptions.value')
                            }
                        )
                    )
                    .then(function () {
                        me.set('chargeSuccess', true);
                    })
                    .always(function () {
                        me.set('submiting', false);
                    });
                }
                else {
                    tip({
                        content:'您的充值金额已变动或未发送验证码，请重新发送验证码',
                        type: 'error'
                    });
                }
            }
        }
    });

});