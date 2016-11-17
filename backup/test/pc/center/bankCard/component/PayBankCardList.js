/**
 * @file 支付卡列表
 * @author zhujialu
 */
define(function (require, exports, module) {

    'use strict';

    return Ractive.extend({
        template: require('tpl!./PayBankCardList.html'),
        data: function () {
            return {
                style: require('text!./PayBankCardList.styl'),
                options: {
                    list: [ ]
                }
            };
        },
        components: {
            BankCard: require('./BankCard')
        },
        oncomplete: function () {

            var me = this;

            me.on('BankCard.remove', function (data) {
                me.fire('remove', data);
            });
        }
    });

});