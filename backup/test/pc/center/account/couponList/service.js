/**
 * @file 优惠券相关接口
 * @author niuxiaojing
 */
define(function (require, exports, module) {

    'use strict';

    var service = require('../../common/service');

    exports.getCouponList = function (data) {
        return service.post(
            '/wallet/couponList',
            {
                page: data.page,
                size: data.pageSize,
                status: data.status
            }
        );
    };


});