/**
 * @file 我的钱包
 * @author niuxiaojing
 */
define(function (require, exports, module) {

    'use strict';

    var service = require('./service');
    var constant = require('../common/constant');
    var config = require('../common/config');
    var urlUtil = require('cc/util/url');
    var moment = require('moment');
    var ractiveDialog = require('pc/common/function/ractiveDialog');
    var InputSmsCode = require('../component/InputSmsCode');

    var VIEW_INDEX = 'index';
    var VIEW_CHARGE = 'charge';
    var VIEW_WITHDRAW = 'withdraw';
    var VIEW_WITHDRAW_SUCCESS = 'withdrawSuccess';
    var VIEW_RESET_PAY_PASSWORD_FORM = 'resetPayPasswordform';


    return Ractive.extend({
        template: require('tpl!./home.html'),
        data: function () {
            var me = this;

            var chargeByList = [
                constant.CHARGE_BY_PERSON_EBANK
            ];

            if (userData.isInstitution) {
                chargeByList.push(
                    constant.CHARGE_BY_COMPANY_EBANK
                );
            }

            return {
                style: require('text!./home.styl'),

                view: VIEW_INDEX,
                VIEW_CHARGE: VIEW_CHARGE,
                VIEW_INDEX: VIEW_INDEX,
                VIEW_WITHDRAW: VIEW_WITHDRAW,
                VIEW_WITHDRAW_SUCCESS: VIEW_WITHDRAW_SUCCESS,
                VIEW_RESET_PAY_PASSWORD_FORM: VIEW_RESET_PAY_PASSWORD_FORM,

                avatar: userData.avatar,
                displayName: userData.displayName,
                mobile: userData.mobile,

                balanceOptions: {
                    list: '',
                    isStudent: userData.isStudent,
                    isInstitution: userData.isInstitution,
                    USER_ROLE_STUDENT: constant.USER_ROLE_STUDENT,

                    onChargeClick: function () {
                        me.set('view', VIEW_CHARGE);
                    },
                    onWithdrawClick: function () {
                        var withdrawCardCount = me.get('balanceOptions.withdraw_card_count');
                        if (!withdrawCardCount) {
                            alert({
                                title: '温馨提示',
                                content: '为保证您的资金安全，请绑定您本人的储蓄卡进行提现。'
                                       + '<br>如有疑问，请拨打客服热线4000-910-910',
                                removeClose: false,
                                buttons: [
                                    {
                                        text: '绑定银行卡',
                                        type: 'primary',
                                        action: function () {
                                            location.href = urlUtil.mixin(
                                                {
                                                    tab: constant.TAB_ACCOUNT,
                                                    sub_tab: constant.SUBTAB_BANK_CARD
                                                },
                                                true
                                            );
                                            this.hide();
                                        }
                                    }
                                ]
                            });
                        }
                        else if (userData.isInstitution) {
                            var dialog = ractiveDialog(
                                InputSmsCode,
                                {
                                    title: '提现',
                                    width: 450
                                },
                                {
                                    mobile: userData.mobile,
                                    buttonName: '申请提现',
                                    sendVerifyCode: function () {
                                        return service
                                        .sendVerifyCode();
                                    },
                                    sendVoiceCode: function () {
                                        return service
                                        .sendVoiceCode();
                                    },
                                    submit: function (data) {
                                        me.set('withdrawOptions.code', data.code);
                                        return service
                                        .checkSms(data);
                                    },
                                    onSuccess: function () {
                                        me.set('view', VIEW_WITHDRAW);
                                        dialog.dispose();
                                    }
                                }
                            );

                        }
                        else {
                            me.set('view', VIEW_WITHDRAW);
                        }

                    },
                    showCoupon: function () {
                        location.href = urlUtil.mixin(
                            {
                                tab: constant.TAB_ACCOUNT,
                                sub_tab: constant.SUBTAB_COUPON
                            },
                            true
                        );
                    },
                    showCard: function () {
                        location.href = urlUtil.mixin(
                            {
                                tab: constant.TAB_ACCOUNT,
                                sub_tab: constant.SUBTAB_BANK_CARD
                            },
                            true
                        );
                    },
                    showBalanceRecord: function () {
                        location.href = urlUtil.mixin(
                            {
                                tab: constant.TAB_FUND,
                                sub_tab: constant.SUBTAB_BALANCE_RECORD
                            },
                            true
                        );
                    },
                    loadMore: function () {
                        location.href = urlUtil.mixin(
                            {
                                tab: constant.TAB_FUND,
                                sub_tab: constant.SUBTAB_TRADE_RECORD
                            },
                            true
                        );
                    }
                },
                withdrawOptions: {
                    totalMoney: '',
                    bankLogo: '',
                    cardNumber: '',
                    withdrawMoney: '',
                    password: '',
                    cardId: '',
                    code: '',
                    isTianxiao: '',

                    userRole: userData.role,
                    USER_ROLE_STUDENT: constant.USER_ROLE_STUDENT,
                    USER_ROLE_TEACHET: constant.USER_ROLE_TEACHET,
                    USER_ROLE_INSTITUTION: constant.USER_ROLE_INSTITUTION,

                    back: function () {
                        me.set('view', VIEW_INDEX);
                    },

                    submit: function () {
                        alert({
                            title: '温馨提示',
                            content: '您正在使用电脑提现，每笔会收取1元手续费，'
                                   + '推荐下载APP使用手机提现免手续费哦~',
                            width: 200,
                            buttons: [
                                {
                                    text: '下载APP手机提现',
                                    type: 'primary',
                                    action: function () {
                                        me.downloadAPP();
                                        this.hide();
                                    }
                                },
                                {
                                    text: '仍然电脑提现',
                                    action: function () {
                                        var data = {
                                            withdrawMoney: me.get('withdrawOptions.withdrawMoney'),
                                            password: me.get('withdrawOptions.password'),
                                            cardId: me.get('withdrawOptions.cardId')
                                        };
                                        if (userData.isInstitution) {
                                            data.code = me.get('withdrawOptions.code');
                                        }
                                        this.hide();
                                        service
                                        .withdraw(data)
                                        .then(function (response) {
                                            me.set('view', VIEW_WITHDRAW_SUCCESS);
                                        });
                                    }
                                }
                            ]
                        });
                    },

                    getPassword: function () {
                        me.set('view', VIEW_RESET_PAY_PASSWORD_FORM);
                    },
                    downloadAPP: function () {
                        me.downloadAPP();
                    }
                },
                withdrawSuccessOptions: {
                    back: function () {
                        me.set('view', VIEW_INDEX);
                    }
                },
                chargeOptions: {
                    chargeBy: constant.CHARGE_BY_PERSON_EBANK,
                    chargeByList: chargeByList,
                    chargeByPersonEbankOptions: {
                        isCompanyEbank: false,
                        balance: '',
                        amount: '',
                        bankNumber: null,
                        bankList: [ ],
                        back: function () {
                            me.set('view', VIEW_INDEX)
                        }
                    },
                    onReady: function () {

                    }
                },
                resetPayPasswordFormOptions: {
                    mobile: userData.mobile,
                    sendVerifyCode: function () {
                        return service
                        .sendVerifyCode();
                    },
                    onNext: function (data) {
                        return service
                        .checkSms(data)
                    },
                    submit: function (data) {
                        return service
                        .resetPassword(data);
                    },
                    onSuccess: function () {
                        me.set('view', VIEW_WITHDRAW);
                    }
                }
            };
        },
        components: {
            Balance: require('./component/Balance'),
            Withdraw: require('./component/Withdraw'),
            WithdrawSuccess: require('./component/WithdrawSuccess'),
            Charge: require('./component/Charge'),
            ResetPayPasswordForm: require('../component/ResetPayPasswordForm'),
        },
        oncomplete: function () {
            var me = this;

            me.observe('view', function (view) {
                if (view === VIEW_INDEX) {
                    me.getBalanceInfo();
                    me.getTradeRecord();
                    me.getCardList();
                }
                else if (view === VIEW_WITHDRAW) {
                    me.getBalanceInfo();
                    me.set({
                        'withdrawOptions.withdrawMoney': '',
                        'withdrawOptions.password': ''
                    });
                }
            });

            me.getTradeRecord();
        },

        // 获取余额信息
        getBalanceInfo: function () {
            var me = this;
            var balanceOptions = me.get('balanceOptions');
            service
            .getBalanceInfo()
            .then(function (response) {
                var data = response.data;
                var balance = data.account_info.balance;
                $.extend(
                    balanceOptions,
                    data.account_info,
                    data.card_info
                );
                me.set({
                    'balanceOptions': balanceOptions,
                    'withdrawOptions.totalMoney': balance,
                    'withdrawOptions.isTianxiao': data.account_info.is_tx,
                    'chargeOptions.chargeByPersonEbankOptions.balance': balance,
                    'chargeOptions.chargeByCompanyEbankOptions.balance': balance
                });
            });

            if (userData.role == constant.USER_ROLE_STUDENT) {
                service
                .getCouponList({
                    status: 0
                })
                .then(function (response) {
                    me.set('balanceOptions.couponCount',
                        response.data.total
                    );
                });
            }
        },

        // 获取交易明细
        getTradeRecord: function () {
            var me = this;
            service
            .getTradeRecord({
                page: 1,
                pageSize: 10,
                startTime: '',
                endTime: ''
            })
            .then(
                function (response) {
                    var rows = response.data.records;
                    me.set('balanceOptions.list', rows)
                }
            );
        },

        // 获取银行卡信息
        getCardList: function () {
            var me = this;
            service
            .getCardList()
            .then(function (response) {
                var withdrawCard = response.data.withdraw_list[0];
                if (withdrawCard) {
                    var data = {
                        'withdrawOptions.bankLogo': withdrawCard.bank_icon_url,
                        'withdrawOptions.cardNumber': withdrawCard.card_no,
                        'withdrawOptions.cardId': withdrawCard.card_id
                    };
                    me.set(data);
                }
            });
        },
        downloadAPP: function () {
            var role = userData.role;
            window.open(config.roleUrl[role].downloadAppUrl);
        }
    });

});