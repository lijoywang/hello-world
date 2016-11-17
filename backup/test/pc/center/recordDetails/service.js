/**
 * @file 交易记录明细接口
 * @author niuxiaojing
 */
define(function (require, exports, module) {

    'use strict';

    var service = require('../common/service');

    exports.getTradeRecord = function (data) {
        return service.post(
            '/wallet/tradeRecord',
            {
                page: data.page,
                size: data.pageSize,
                start_time: data.startTime,
                end_time: data.endTime,
                teacher_id: data.teacherId
            }
        );
    };

    exports.getBalanceRecord = function (data) {
        return service.post(
            '/wallet/balanceRecord',
            {
                page: data.page,
                size: data.pageSize,
                start_time: data.startTime,
                end_time: data.endTime,
                teacher_id: data.teacherId
            }
        );
    };

    exports.getOrgTeachers = function () {
        return service.post(
            '/wallet/orgTeachers'
        );
    };

});