/**
 * @file 余额信息组件
 * @author niuxiaojing
 */
define(function (require, exports, module) {

    'use strict';

    var constant = require('../../common/constant');

    return Ractive.extend({
        template: require('tpl!./Balance.html'),
        data: function () {
            return {
                style: require('text!./Balance.styl'),
                options: {
                    list: [],

                    isStudent: '',
                    isInstitution: '',
                    USER_ROLE_STUDENT: '',

                    balance: '',
                    pay_card_count: '',
                    withdraw_card_count: '',
                    expected_earning: '',
                    income: '',
                    week_income: '',
                    month_income: '',
                    couponCount: '',

                    onChargeClick: $.noop,
                    onWithdrawClick: $.noop,
                    showCoupon: $.noop,
                    showCard: $.noop,
                    showBalanceRecord: $.noop,
                    loadMore: $.noop
                }
            }
        },
        charge: function () {
            this.get('options.onChargeClick')();
        },
        withdraw: function () {
            this.get('options.onWithdrawClick')();
        },
        showCoupon: function () {
            this.get('options.showCoupon')();
        },
        showCard: function () {
            this.get('options.showCard')();
        },
        showBalanceRecord: function () {
            this.get('options.showBalanceRecord')();
        },
        loadMore: function () {
            this.get('options.loadMore')();
        }


    });
});