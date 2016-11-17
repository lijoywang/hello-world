/**
 * @file 银行卡相关接口
 * @author zhujialu
 */
define(function (require, exports, module) {

    'use strict';

    var service = require('../common/service');

    exports.getBankUserInfo = function () {
        return service.post(
            '/wallet/bankUserInfo'
        );
    };

    exports.getBankCardList = function () {
        return service.post(
            '/wallet/getCardList'
        );
    };

    exports.getSupportedPayBankList = function () {
        return service.post(
            '/wallet/bindCardBankList'
        );
    };

    exports.getSupportedWithdrawBankList = function () {
        return service.post(
            '/wallet/drawCashBankList'
        );
    };

    exports.bindBankCardBySms = function (data, options) {
        return service.post(
            '/wallet/bindPayBankSendSms',
            {
                owner_name: data.userName,
                id_number: data.userId,
                mobile: data.userMobile,
                bank_no: data.bankNumber,
                card_no: data.bankCardNumber,
                card_type: data.bankCardType,
                bind_type: data.bindType,
                cvv: data.cvv,
                exp: data.expireYear + '-' + data.expireMonth,
                region: data.province + '_' + data.city,
            },
            options
        );
    };

    exports.bindBankCardVerify = function (data) {
        return service.post(
            '/wallet/bindPayBankVerify',
            {
                token: data.token,
                code: data.verifyCode,
            }
        );
    };

    exports.bindBankCardForce = function (data) {
        return service.post(
            '/wallet/forceBindDrawCard',
            {
                owner_name: data.userName,
                id_number: data.userId,
                mobile: data.userMobile,
                bank_no: data.bankNumber,
                card_no: data.bankCardNumber,
                region: data.province + '_' + data.city,
            }
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

    /**
     * 提现卡只有一张，所以不需要 id
     */
    exports.removeWithdrawBankCard = function (data) {
        return service.post(
            '/wallet/deleteBankCard',
            {
                pay_password: data.payPassword
            }
        );
    };

    exports.removePayBankCard = function (data) {
        return service.post(
            '/wallet/deletePayBankCard',
            {
                card_id: data.bankCardId,
                pay_password: data.payPassword
            }
        );
    };

    exports.getBankCardSuggestion = function (data) {
        return service.post(
            '/wallet/suggestBank',
            {
                bank_num: data.bankCardNumber
            },
            {
                preventError: true
            }
        );
    };

});