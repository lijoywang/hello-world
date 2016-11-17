/**
 * @file 账号管理
 * @author niuxiaojing
 */
define(function (require, exports, module) {

    'use strict';

    var urlUtil = require('cc/util/url');

    var bankCardConstant = require('../bankCard/constant');
    var bankCardService = require('../bankCard/service');

    var constant = require('../common/constant');

    function mapBankCard(item, canReplace, canRemove) {
        return {
            bankLogo: item.bank_icon_url,
            bankName: item.bank_name,
            bankCardId: item.card_id,
            bankCardNumber: item.card_no,
            bankCardType: item.card_type,
            userName: item.owner_name,
            userMobile: item.owner_mobile,
            canReplace: canReplace,
            canRemove: canRemove
        };
    }

    var tabRouter = {};
    tabRouter[constant.SUBTAB_BANK_CARD] = constant.SUBTAB_BANK_CARD;
    tabRouter[constant.SUBTAB_COUPON] = constant.SUBTAB_COUPON;

    return Ractive.extend({
        template: require('tpl!./account.html'),
        data: function () {
            var me = this;

            var hasCoupon = false;
            var navigatorList = [
                {
                    id: constant.SUBTAB_BANK_CARD,
                    label: '我的银行卡',
                    onClick: function () {
                        me.set('options.tab', constant.SUBTAB_BANK_CARD);
                    }
                }
            ];

            if (userData.role == constant.USER_ROLE_STUDENT) {
                hasCoupon = true;
                navigatorList.push({
                    id: constant.SUBTAB_COUPON,
                    label: '我的优惠券',
                    onClick: function () {
                        me.set('options.tab', constant.SUBTAB_COUPON);
                    }
                });
            }

            var tab = layoutInstance.get('sub_tab');
            tab = tabRouter[tab] || constant.SUBTAB_BANK_CARD;

            var supportPayBankCard = !userData.isInstitution;

            return {
                style: require('text!./account.styl'),
                hasCoupon: hasCoupon,
                SUBTAB_COUPON: constant.SUBTAB_COUPON,
                SUBTAB_BANK_CARD: constant.SUBTAB_BANK_CARD,

                options: {
                    tab: tab
                },

                navigatorOptions: {
                    list: navigatorList,
                    selectedIndex: 0
                },

                BIND_TYPE_NEW_PAY: bankCardConstant.BIND_TYPE_NEW_PAY,
                BIND_TYPE_NEW_WITHDRAW: bankCardConstant.BIND_TYPE_NEW_WITHDRAW,
                BIND_TYPE_EDIT_WITHDRAW: bankCardConstant.BIND_TYPE_EDIT_WITHDRAW,

                bindBankCardOptions: {

                },
                bankCardListOptions: {
                    supportPayBankCard: supportPayBankCard,
                    supportWithdrawBankCard: true,
                    payBankCardList: null,
                    withdrawBankCardList: null,
                    onReady: function () {
                        bankCardService
                        .getBankCardList()
                        .then(function (response) {
                            var data = response.data;
                            me.set({
                                'bankCardListOptions.hasPayPassword': data.has_pay_pwd,
                                'bankCardListOptions.payBankCardList': $.map(
                                    data.pay_list,
                                    function (item) {
                                        return mapBankCard(item, false, true);
                                    }
                                ),
                                'bankCardListOptions.withdrawBankCardList': $.map(
                                    data.withdraw_list,
                                    function (item) {
                                        return mapBankCard(item, false, true);
                                    }
                                )
                            });
                        });
                    },
                    onBindCardClick: function (data) {
                        var isInstitution = userData.isInstitution;
                        me.set(
                            'bindBankCardOptions',
                            {
                                bindType: data.bindType,
                                accountType: isInstitution
                                    ? null
                                    : bankCardConstant.ACCOUNT_TYPE_PERSON,
                                companyBindBankCardFormOptions: {
                                    companyName: '',
                                    bankNumber: '',
                                    bankCardNumber: '',
                                    bankLocation: {
                                        province: '',
                                        city: ''
                                    }
                                },
                                personBindBankCardFormOptions: {
                                    canBindForce: false,
                                    userNameReadOnly: false,
                                    userIdReadOnly: false,
                                    userName: '',
                                    userId: '',
                                    userMobile: '',
                                    bankCardNumber: '',
                                    bankLocation: {
                                        province: '',
                                        city: ''
                                    },
                                    verifyCode: ''
                                },
                                bindBankCardSuccessOptions: {
                                    seconds: 3,
                                    buttonText: '前往我的银行卡',
                                    onComplete: function () {
                                        location.reload();
                                    }
                                },
                                onReady: function () {
                                    var isWithdraw =
                                        data.bindType == bankCardConstant.BIND_TYPE_NEW_WITHDRAW
                                        || data.bindType == bankCardConstant.BIND_TYPE_EDIT_WITHDRAW;

                                    if (!isInstitution && isWithdraw) {
                                        bankCardService
                                        .getBankUserInfo()
                                        .then(function (response) {
                                            var data = response.data;
                                            var userId = data.id_number;
                                            var userName = data.name;
                                            var canBindForce = data.use_force_bind;
                                            var keypath = 'bindBankCardOptions.personBindBankCardFormOptions';
                                            var data = { };
                                            data[keypath + '.canBindForce'] = canBindForce;
                                            data[keypath + '.userId'] = userId;
                                            data[keypath + '.userIdReadOnly'] = !!userId;
                                            data[keypath + '.userName'] = userName;
                                            data[keypath + '.userNameReadOnly'] = !!userName;
                                            me.set(data);
                                        });
                                    }
                                }
                            }
                        );
                    }
                }
            };
        },
        components: {
            Navigator: require('../component/Navigator'),
            BindBankCard: require('../bankCard/bindBankCard/bindBankCard'),
            BankCardList: require('../bankCard/bankCardList/bankCardList'),
            CouponList: require('./couponList/couponList')
        },
        oncomplete: function () {
            var me = this;

            me.observe('options.tab', function (tab) {
                tab = tabRouter[tab];
                if (tab) {
                    location.href = urlUtil.mixin(
                        {
                            sub_tab: tab
                        },
                        true
                    );
                    var list = me.get('navigatorOptions.list');
                    var selectedIndex = null;
                    $.each(list, function (index, item) {
                        if (item.id == tab) {
                            selectedIndex = index;
                        }
                    });
                    if (selectedIndex != null) {
                        me.set(
                            'navigatorOptions.selectedIndex',
                            selectedIndex
                        );
                    }
                }
            });

        }
    });

});