/**
 * @file 页面底部
 * @author zhujialu
 */
define(function (require, exports, module) {

    'use strict';

    var Dialog = require('../custom/ui/Dialog');

    return Ractive.extend({
        template: require('tpl!./Footer.html'),
        showWechatQrcode: function () {
            new Dialog({
                title: '跟谁学官方微信',
                content: require('tpl!./wechatQrcode.html'),
                footer: '',
                removeOnEmpty: true,
                skinClass: 'wechat-qrcode-dialog'
            });
        }
    });

});