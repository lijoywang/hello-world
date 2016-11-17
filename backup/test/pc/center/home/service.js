/**
 * @file 接口
 * @author niuxiaojing
 */
define(function (require, exports, module) {

    'use strict';

    var service = require('../common/service');

    /**
     * 获取首页余额等信息
     *
     * @return {Promise}
     */
    exports.getBalanceInfo = function () {
        return service.post(
            '/wallet/accountInfo'
        );
    };

    /**
     * 获取交易记录
     *
     * @return {Promise}
     */
    exports.getTradeRecord = function (data) {
        return service.post(
            '/wallet/tradeRecord',
            {
                page: data.page,
                size: data.pageSize,
                start_time: data.startTime,
                end_time: data.endTime
            }
        );
    };

    /**
     * 获取余额记录
     *
     * @return {Promise}
     */
    exports.getBalanceRecord = function (data) {
        return service.post(
            '/wallet/balanceRecord',
            data
        );
    };

    /**
     * 获取银行卡信息
     *
     * @return {Promise}
     */
    exports.getCardList = function () {
        return service.post(
            '/wallet/getCardList'
        );
    };

    /**
     * 获取绑定银行卡信息
     */
    exports.getChargeBankList = function () {
        return service.post(
            '/wallet/rechargeBankList'
        );
    };

    /**
     * 获取支持的绑定银行卡列表
     */

    exports.getRechargeBankList = function (data) {
        return service.post(
            '/wallet/getRechargeBankList'
        );
    };

    /**
     * 充值
     *
     * @return {Promise}
     */
    exports.charge = function (data) {
        return service.post(
            '/wallet/createRechargeOrder2',
            {
                money: data.amount,
                bank_no: data.bankNumber,
                pay_type: data.payType
            },
            {
                sync: true
            }
        );
    };

    /**
     * 提交提现申请
     *
     * @return {Promise}
     */
    exports.withdraw = function (data) {
        return service.post(
            '/wallet/createDrawCashOrder',
            {
                money: data.withdrawMoney,
                pay_password: data.password,
                card_id: data.cardId,
                sms_code: data.code
            }
        );
    };

    /**
     * 获取学生优惠券信息
     *
     * @return {Promise}
     */
    exports.getCouponList = function (data) {
        return service.post(
            '/wallet/couponList',
            {
                page: data.page,
                size: data.size,
                status: data.status
            }
        );
    };

    /**
     * 发送验证码
     *
     * @return {Promise}
     */
    exports.sendVerifyCode = function () {
        return service.post(
            '/wallet/sendSms'
        );
    };

    /**
     * 发送语音验证码
     *
     * @return {Promise}
     */
    exports.sendVoiceCode = function () {
        return service.post(
            '/wallet/sendSms',
            {
                voice: 1
            }
        );
    };

    /**
     * 校验验证码
     *
     * @return {Promise}
     */
    exports.checkSms = function (data) {
        return service.post(
            '/wallet/checkSms',
            {
                sms_code: data.code
            }
        );
    };

    /**
     * 重置密码
     *
     * @return {Promise}
     */
    exports.resetPassword = function (data) {
        return service.post(
            '/wallet/resetPayPassword',
            {
                sms_code: data.code,
                pay_password: data.payPassword
            }
        );
    };

    /**
     * 发送短信验证码
     *
     * @return {Promise}
     */
    exports.sendCode = function (params) {
        return service.post(
            '/wallet/createRechargeAndVerify',
            {
                money: params.money,
                cash_type: params.cash_type || 2, // 2为快捷支付网银在线储蓄卡首次,5为快捷支付网银在线储蓄卡再次
                double_tunnel: params.double_tunnel || 1, // 双通道快捷支付验证,默认为1优先快钱
                owner_name: params.owner_name, // 持卡人姓名,首次绑卡支付必填
                owner_id: params.owner_id, // 持卡人身份证号,首次绑卡支付必填
                owner_mobile: params.owner_mobile, // 银行预留手机号
                card_name: params.card_name, // 银行名称，例如cmb
                card_type: params.card_type || 'D', // 银行卡类型，D储蓄卡
                pay_type: params.pay_type || 11, // 支付类型,快捷支付为11
                unique_id: params.unique_id // 银行卡唯一编号，首次绑卡支付传卡号
            }
        );
    };

    /**
     * 生成充值订单并验证快捷支付
     *
     * @return {Promise}
     */
    exports.rechargePay = function (params) {
        return service.post(
            '/wallet/rechargePay',
            params
        );
    };

    exports.bindCompanyBankCard = function (data) {
        return service.post(
            '/wallet/bindCompanyDrawCashCard',
            {
                owner_name: data.companyName,
                region: data.province + '_' + data.city,
                card_num: data.bankCardNumber,
                bank_no: data.bankNumber
            }
        );
    };

    // 获取绑定储蓄银行卡列表
    exports.getRechargeBankCard = function (data) {
        return service.post(
            '/wallet/getRechargeBankCard'
        );
    };

});