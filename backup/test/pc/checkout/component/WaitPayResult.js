/**
 * @file 等待付款结果对话框
 * @author niuxiaojing
 */
define(function (require, exports) {

    'use strict'

    var service = require('../service');

    return {
        template: require('tpl!./WaitPayResult.html'),
        data: {
            style: require('text!./WaitPayResult.styl'),
            purchaseId: '',
        },
        oncomplete: function () {

        },
        paySuccess: function () {

            this.closeDialog();
        },

        payFailure: function () {
            this.closeDialog();
            // location.href = '#';
        }
    }

});