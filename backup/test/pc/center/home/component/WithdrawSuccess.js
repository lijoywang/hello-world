/**
 * @file 提现成功
 * @author niuxiaojing
 */
define(function (require, exports, module) {

    'use strict';


    return Ractive.extend({
        template: require('tpl!./WithdrawSuccess.html'),
        data: function () {
            return {
                style: require('text!./WithdrawSuccess.styl'),
                options: {
                    back: $.noop
                }
            }
        },
        back: function () {
            this.get('options.back')();
        }

    });
});