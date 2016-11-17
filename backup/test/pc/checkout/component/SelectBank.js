/**
 * @file 选择网上银行对话框
 * @author niuxiaojing
 */
define(function (require, exports) {

    'use strict'

    var service = require('../service');
    var waitPay = require('./WaitPayResult');
    var ractiveDialog = require('../../common/function/ractiveDialog');


    return {
        template: require('tpl!./SelectBank.html'),
        data: {
            style: require('text!./SelectBank.styl'),
            supportedBankList: [],
            payMoney: '',
            userId: '',
            purchaseId: '',
            getPayResultOnce: $.noop

        },
        oncomplete: function () {

        },
        selectBank: function (bankNumber) {
            var me = this;
            service
            .submit({
                user_id: this.get('userId'),
                purchase_id: this.get('purchaseId'),
                pay_type: '24:' + this.get('payMoney'),
                bank_no: bankNumber
            })
            .then(function (response) {
                if (!response.code) {
                    me.closeDialog();
                    waitPay.data.purchaseId = me.get('purchaseId');

                    var waitPayDialog = ractiveDialog(
                        $.extend({}, waitPay)
                    );

                    waitPayDialog.once('beforehide', function () {
                        var getPayResultOnce = me.get('getPayResultOnce');
                        getPayResultOnce();
                    });
                    waitPayDialog.show();
                    window.open(response.data.pay_url);
                }
            });
        }
    };

});