/**
 * @file 微信支付扫码对话框
 * @author niuxiaojing
 */
define(function (require, exports) {

    'use strict'

    var qrcode = require('../../../common/function/qrcode');


    return {
        template: require('tpl!./WechatPay.html'),
        data: {
            style: require('text!./WechatPay.styl'),
            url: '',
            payMoney: '',
            imageDir: require.toUrl('.')
        },
        oncomplete: function () {
            var container = $(this.getElement());
            qrcode({
                text: this.get('url'),
                element: container.find('.qrcode'),
                width: 160,
                height: 160
            });
        }
    };

});