/**
 * @file 资金明细接口
 * @author zhujialu
 */
define(function (require, exports, module) {

    'use strict';

    var service = require('common/service');

    function post(url, data, options) {
        options = options || { };
        return service.post(url, data, options);
    }

    /**
     * 联盟账户是否可以提现和充值
     *
     * {
     *     data: {
     *         status: 0|1   // 0 不可以，1 可以
     *     }
     * }
     *
     * @param {Object} data
     * @property {string} data.leagueId 联盟 ID
     * @return {Promise}
     */
    exports.getLeagueAccountDrawCashSwitch = function (data) {
        return post(
            '/league/leagueAccountDrawCashSwitch',
            {
                league_id: data.leagueId
            },
            arguments[1]
        );
    };

    /**
     * 联盟账户金额明细
     *
     * @param {Object} data
     * @property {string} data.leagueId 联盟 ID
     * @return {Promise}
     */
    exports.getLeagueAccountDetail = function (data) {
        return post(
            '/league/leagueAccountDetail',
            {
                league_id: data.leagueId
            },
            arguments[1]
        );
    };

    /**
     * 联盟账户资金明细
     *
     * @param {Object} data
     * @property {string} data.leagueId 联盟 ID
     * @property {string} data.startTime 开始时间
     * @property {string} data.endTime 开始时间
     * @property {number} data.page 页码
     * @property {number} data.pageSize 每页的数量
     * @return {Promise}
     */
    exports.getLeagueAccountRecordDetail = function (data) {
        return post(
            '/league/leagueAccountRecordDetail',
            {
                league_id: data.leagueId,
                start_time: service.toTimestamp(data.startTime) / 1000,
                end_time: service.toTimestamp(data.endTime) / 1000,
                offset: data.page,
                size: data.pageSize
            },
            arguments[1]
        );
    };

    /**
     * 联盟账户绑定银行卡列表
     *
     * @param {Object} data
     * @property {string} data.leagueId 联盟 ID
     * @return {Promise}
     */
    exports.getAccountCardList = function (data) {
        return post(
            '/league/leagueAccountCardList',
            {
                league_id: data.leagueId
            },
            arguments[1]
        );
    };

    /**
     * 联盟账户提现详情
     *
     * @param {Object} data
     * @property {string} data.leagueId 联盟 ID
     * @return {Promise}
     */
    exports.getAccountDrawCashDetail = function (data) {
        return post(
            '/league/leagueAccountDrawCashDetail',
            {
                league_id: data.leagueId
            },
            arguments[1]
        );
    };

    /**
     * 联盟账户提现
     *
     * @param {Object} data
     * @property {string} data.leagueId 联盟 ID
     * @property {number} data.amount 提现金额
     * @property {number=} data.fee 手续费，默认是 0
     * @return {Promise}
     */
    exports.accountDrawCash = function (data) {
        return post(
            '/league/leagueAccountDrawCash',
            {
                league_id: data.leagueId,
                amount: data.amount,
                fee_amount: data.fee || 0
            },
            arguments[1]
        );
    };

    /**
     * 获取支持的银行列表
     *
     * @return {Promise}
     */
    exports.getSupportBankList = function () {
        return post(
            '/league/supportBankList'
        );
    };

    /**
     * 绑卡发送手机验证码
     *
     * @param {Object} data
     * @property {string} data.leagueId
     * @property {string} data.bankNo
     * @property {string} data.cardNum
     * @property {string} data.ownerName
     * @property {string} data.ownerId
     * @property {string} data.ownerMobile
     * @return {Promise}
     */
    exports.sendSMS = function (data) {
        return post(
            '/league/bindCardForPerVerify',
            {
                league_id: data.leagueId,
                bank_no: data.bankNo,
                card_num: data.cardNum,
                owner_name: data.ownerName,
                id_number: data.ownerId,
                mobile: data.ownerMobile
            },
            arguments[1]
        );
    };

    /**
     * 个人绑卡
     *
     * @param {Object} data
     * @property {string} data.leagueId
     * @property {string} data.bankNo
     * @property {string} data.cardNum
     * @property {string} data.region 开户区域
     * @property {string} data.ownerId
     * @property {string} data.ownerName
     * @property {string} data.ownerMobile
     * @property {string} data.purchaseId
     * @property {string} data.token
     * @property {string} data.smsCode
     * @return {Promise}
     */
    exports.bindCardForPerson = function (data) {
        return post(
            '/league/bindCardForPer',
            {
                league_id: data.leagueId,
                bank_no: data.bankNo,
                card_num: data.cardNum,
                region: data.region,

                id_number: data.ownerId,
                owner_name: data.ownerName,
                mobile: data.ownerMobile,

                purchase_id: data.purchaseId,
                third_type: data.thirdType,
                token: data.token,
                sms_code: data.smsCode
            },
            arguments[1]
        );
    };

    /**
     * 企业绑卡
     *
     * @param {Object} data
     * @property {string} data.leagueId
     * @property {string} data.bankNo
     * @property {string} data.cardNum
     * @property {string} data.region 开户区域
     * @property {string} data.ownerId
     * @property {string} data.companyName
     * @return {Promise}
     */
    exports.bindCardForCompany = function (data) {
        return post(
            '/league/bindCardForCot',
            {
                league_id: data.leagueId,
                bank_no: data.bankNo,
                card_num: data.cardNum,
                region: data.region,
                id_number: data.ownerId,
                owner_name: data.companyName
            },
            arguments[1]
        );
    };

    /**
     * 解绑银行卡
     *
     * @param {Object} data
     * @property {string} data.leagueId
     * @return {Promise}
     */
    exports.unbindCard = function (data) {
        return post(
            '/league/unbindCard',
            {
                league_id: data.leagueId
            },
            arguments[1]
        );
    };

    /**
     * 获取用户手机号
     *
     * @param {Object} data
     * @property {string} data.leagueId
     * @return {Promise}
     */
    exports.getUserInfo = function (data) {
        return post(
            '/account/userInfo',
            {
                user_id: data.leagueId
            },
            arguments[1]
        );
    };

    /**
     * 获取验证码
     *
     * @param {Object} data
     * @property {string} data.leagueId
     * @return {Promise}
     */
    exports.verifyMobile = function (data) {
        return post(
            '/sms/verifyMobile',
            {
                league_id: data.leagueId
            },
            arguments[1]
        );
    };

    /**
     * 获取验证码
     *
     * @param {Object} data
     * @property {string} data.leagueId
     * @property {string} data.code
     * @return {Promise}
     */
    exports.checkMobile = function (data) {
        return post(
            '/sms/checkMobile',
            {
                league_id: data.leagueId,
                sms_code: data.code
            },
            arguments[1]
        );
    };

});