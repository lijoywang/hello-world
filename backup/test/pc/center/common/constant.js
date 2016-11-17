/**
 * @file 钱包常量
 * @author zhujialu
 */
define(function (require, exports, module) {

    'use strict';

    exports.TAB_INDEX = 'index';
    exports.TAB_ACCOUNT = 'account';
    exports.TAB_FUND = 'fund';

    exports.SUBTAB_BANK_CARD = 'bankCard';
    exports.SUBTAB_COUPON = 'coupon';
    exports.SUBTAB_TRADE_RECORD = 'trade';
    exports.SUBTAB_BALANCE_RECORD = 'balance';


    exports.USER_ROLE_TEACHET = 0;
    exports.USER_ROLE_INSTITUTION = 6;
    exports.USER_ROLE_STUDENT = 2;


    exports.COUPON_UNUSED = 0;
    exports.COUPON_USED = 1;
    exports.COUPON_OUT_OF_DATE = 2;

    exports.CHARGE_BY_PERSON_EBANK = 'person_ebank';
    exports.CHARGE_BY_COMPANY_EBANK = 'company_ebank';
    exports.CHARGE_BY_BALANCE = 'balance';

    /**
     * 网银
     *
     * @type {number}
     */
    exports.PAY_TYPE_EBANK = 3;

});