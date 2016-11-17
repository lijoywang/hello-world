/**
 * @file 收银接口
 * @author niuxiaojing
 */
define(function (require, exports) {

    'use strict';

    var service = require('common/service');

    exports.payProductPurchase = function (data) {
        return service.post(
            '/purchase/payProductPurchase',
            data
        );
    };
    exports.submit = function (data) {
        return service.post(
            '/purchase/thirdPartyPay',
            data,
            {sync : true}
        );
    };
    exports.sendCode = function (data) {
        return service.post(
            '/purchase/cashPayVerify',
            data
        );
    };
    exports.getBankList = function (data) {
        return service.post(
            '/purchase/getAllBillBankList',
            data
        );
    };
    exports.getPurchaseStatus = function (data) {
        return service.post(
            '/purchase/checkPurchaseStatus',
            data
        );
    };


});
