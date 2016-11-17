/**
 * @file 银行卡展示
 * @author zhujialu
 */
define(function (require, exports, module) {

    'use strict';

    var constant = require('../constant');

    function fireEvent(instance, type, data) {
        instance.fire(
            type,
            {
                index: instance.get('index'),
                bankCardId: instance.get('options.bankCardId')
            }
        );
    }

    return Ractive.extend({
        template: require('tpl!./BankCard.html'),
        data: function () {
            return {
                style: require('text!./BankCard.styl'),
                index: 0,
                BANK_CARD_TYPE_DEPOSITS: constant.BANK_CARD_TYPE_DEPOSITS,
                BANK_CARD_TYPE_CREDIT: constant.BANK_CARD_TYPE_CREDIT,
                options: {
                    bankLogo: '',
                    bankName: '',
                    bankCardId: '',
                    bankCardNumber: '',
                    bankCardType: 1,
                    userName: '',
                    userMobile: '',
                    canReplace: false,
                    canRemove: false,
                }
            };
        },
        replace: function () {
            fireEvent(this, 'replace');
        },
        remove: function () {
            var me = this;
            confirm({
                title: '温馨提示',
                content: '确定要删除该银行卡吗？'
            })
            .then(function () {
                fireEvent(me, 'remove');
            });
        }
    });

});