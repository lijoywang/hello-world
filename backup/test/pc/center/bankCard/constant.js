/**
 * @file 银行卡
 * @author zhujialu
 */
define(function (require, exports, module) {

    'use strict';

    /**
     * 个人账户
     *
     * @type {number}
     */
    exports.ACCOUNT_TYPE_PERSON = 1;

    /**
     * 企业账户
     *
     * @type {number}
     */
    exports.ACCOUNT_TYPE_COMPANY = 2;

    /**
     * 银行卡类型 - 储蓄卡
     *
     * @type {string}
     */
    exports.BANK_CARD_TYPE_DEPOSITS = 'D';

    /**
     * 银行卡类型 - 信用卡
     *
     * @type {string}
     */
    exports.BANK_CARD_TYPE_CREDIT = 'C';

    /**
     * 新增提现卡
     *
     * @type {number}
     */
    exports.BIND_TYPE_NEW_WITHDRAW = 0;

    /**
     * 修改提现卡
     *
     * @type {number}
     */
    exports.BIND_TYPE_EDIT_WITHDRAW = 1;

    /**
     * 新增支付卡
     *
     * @type {number}
     */
    exports.BIND_TYPE_NEW_PAY = 2;

    /**
     * 至今
     *
     * @type { number}
     */
    exports.YEAR_SOFAR = -1;

});