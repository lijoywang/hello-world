/**
 * @file 充值成功
 * @author zhujialu
 */
define(function (require, exports, module) {

    'use strict';

    var Timer = require('cc/util/Timer');

    return Ractive.extend({
        template: require('tpl!./ChargeSuccess.html'),
        data: function () {
            return {
                style: require('text!./ChargeSuccess.styl'),
                options: {
                    seconds: 3,
                    buttonText: '前往首页',
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