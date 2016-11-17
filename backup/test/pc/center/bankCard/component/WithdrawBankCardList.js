/**
 * @file 提现卡列表
 * @author zhujialu
 */
define(function (require, exports, module) {

    'use strict';

    return Ractive.extend({
        template: require('tpl!./WithdrawBankCardList.html'),
        data: function () {
            return {
                style: require('text!./WithdrawBankCardList.styl'),
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

            me.on('BankCard.replace', function (data) {
                me.fire('replace', data);
            });
            me.on('BankCard.remove', function (data) {
                me.fire('remove', data);
            });
        }
    });

});