/**
 * @file 接口
 * @author zhujialu
 */
define(function (require, exports, module) {

    'use strict';

    var service = require('common/service');

    function post(url, data, options) {

        if (data == null) {
            data = { };
        }
        data.auth_token = exports.authToken;

        if (options == null) {
            options = { };
        }

        var preventError = options.preventError;
        options.preventError = true;

        return service.post(
            url,
            data,
            options
        )
        .always(function (response) {
            if (response.code === 600001) {
                confirm({
                    title: '温馨提示',
                    content: '由于您长时间未操作页面，请前往您的机构中心，重新开启此页面。',
                    buttons: [
                        {
                            text: '前往机构中心',
                            type: 'primary',
                            action: function () {
                                this.hide();
                                location.href = siteData.orgHost
                                              + '/main?tick='
                                              + siteData.orgNumber
                                              + '#/';
                            }
                        },
                        {
                            text: '取消',
                            type: 'secondary',
                            action: function () {
                                this.hide();
                            }
                        }
                    ]
                });
            }
            else {
                var msg = response.msg;
                if (!preventError && msg) {
                    alert({
                        title: '提示',
                        content: msg
                    });
                }
            }
            return response;
        });

    }

    /**
     * 获取余额
     *
     * @return {Promise}
     */
    exports.getWalletBalance = function () {
        return post(
            '/wallet/balance',
            null,
            arguments[1]
        );
    };

    /**
     * 获取明细列表
     *
     * @param {Object} data
     * @property {number} data.type
     * @property {number} data.page
     * @property {number} data.pageSize
     * @return {Promise}
     */
    exports.getWalletRecord = function (data) {
        return post(
            '/wallet/record',
            {
                op_type: data.type,
                page: data.page,
                limit: data.pageSize
            },
            arguments[1]
        );
    };

    /**
     * 获取支持的银行列表
     *
     * @return {Promise}
     */
    exports.getWalletBankList = function () {
        return post(
            '/wallet/bankList',
            null,
            arguments[1]
        );
    };

    /**
     * 充值
     *
     * @param {Object} data
     * @property {number} data.payMoney
     * @property {number} data.payChannel
     * @property {number=} data.payType
     * @property {string=} data.payPassword
     * @property {string=} data.bankNo
     * @return {Promise}
     */
    exports.recharge = function (data) {

        var params = {
            money: data.payMoney,
            pay_channel: data.payChannel
        };

        if (data.payType != null) {
            params.pay_type = data.payType;
        }

        if (data.payPassword != null) {
            params.pay_password = data.payPassword;
        }

        if (data.bankNo != null) {
            params.bank_no = data.bankNo;
        }

        return post(
            '/wallet/createRechargeOrder',
            params,
            arguments[1]
        );

    };

    /**
     * 退费
     *
     * @param {Object} data
     * @property {number} data.payMoney
     * @property {string} data.payPassword
     */
    exports.refund = function (data) {
        return post(
            '/wallet/drawcash',
            {
                money: data.payMoney,
                pay_password: data.payPassword
            },
            arguments[1]
        );
    };

    /**
     * 获取充值结果
     *
     * @param {Object} data
     * @property {number} data.purchaseId
     */
    exports.getRechargeStatus = function (data) {
        return post(
            '/wallet/checkRechargeStatus',
            {
                purchase_id: data.purchaseId
            }
        );
    };

});