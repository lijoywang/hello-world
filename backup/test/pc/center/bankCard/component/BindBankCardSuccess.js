/**
 * @file 绑卡成功
 * @author zhujialu
 */
define(function (require, exports, module) {

    'use strict';

    var Timer = require('cc/util/Timer');

    return Ractive.extend({
        template: require('tpl!./BindBankCardSuccess.html'),
        data: function () {
            return {
                style: require('text!./BindBankCardSuccess.styl'),
                options: {
                    seconds: 3,
                    buttonText: '前往我的银行卡',
                    onComplete: $.noop
                }
            };
        },
        oncomplete: function () {
            var me = this;
            me.timer = new Timer({
                task: function () {
                    var seconds = me.get('options.seconds') - 1;
                    if (seconds > 0) {
                        me.set('options.seconds', seconds);
                    }
                    else {
                        var onComplete = me.get('options.onComplete');
                        if (onComplete) {
                            onComplete();
                        }
                        return false;
                    }
                },
                interval: 1000,
                timeout: 1000
            });
            me.timer.start();
        },
        onteardown: function () {
            this.timer.dispose();
        },
        clickRedirectButton: function () {
            var onComplete = this.get('options.onComplete');
            if (onComplete) {
                onComplete();
            }
        }
    });

});