/**
 * @file 我的银行卡
 * @author zhujialu
 */
define(function (require, exports, module) {

    'use strict';

    var constant = require('../constant');
    var service = require('../service');

    var ractiveDialog = require('pc/common/function/ractiveDialog');

    var homeService = require('../../home/service');
    var PayPasswordInputForm = require('../../component/PayPasswordInputForm');
    var ResetPayPasswordForm = require('../../component/ResetPayPasswordForm');

    return Ractive.extend({
        template: require('tpl!./bankCardList.html'),
        data: function () {
            return {
                style: require('text!./bankCardList.styl'),
                payBankCardListOptions: {
                    list: []
                },
                withdrawBankCardListOptions: {
                    list: []
                },
                options: {
                    hasPayPassword: false,
                    supportPayBankCard: false,
                    supportWithdrawBankCard: false,
                    onReady: $.noop,
                    onBindCardClick: $.noop,
                    payBankCardList: [],
                    withdrawBankCardList: []
                }
            };
        },
        components: {
            BindBankCard: require('../bindBankCard/bindBankCard'),
            PayBankCardList: require('../component/PayBankCardList'),
            WithdrawBankCardList: require('../component/WithdrawBankCardList')
        },
        oncomplete: function () {

            var me = this;
            var bindBankCard = function (bindType) {
                var onBindCardClick = me.get('options.onBindCardClick');
                if (onBindCardClick) {
                    onBindCardClick({
                        bindType: bindType
                    });
                }
            };

            var removeBankCard = function (data, isPayCard) {

                var confirmByPayPassword = function () {

                    var dialog = ractiveDialog(
                        PayPasswordInputForm,
                        {
                            title: '输入支付密码'
                        },
                        {
                            submit: function (params) {
                                dialog.dispose();

                                var method = isPayCard
                                    ? 'removePayBankCard'
                                    : 'removeWithdrawBankCard';

                                service[method]({
                                    bankCardId: data.bankCardId,
                                    payPassword: params.payPassword
                                })
                                .then(function () {

                                    var keypath = isPayCard
                                        ? 'payBankCardListOptions'
                                        : 'withdrawBankCardListOptions';

                                    me.get(keypath + '.list').splice(data.index, 1);

                                    tip({
                                        type: 'success',
                                        content: '删除成功'
                                    });
                                });
                            }
                        }
                    );
                };

                if (me.get('options.hasPayPassword')) {
                    confirmByPayPassword();
                }
                else {
                    var dialog = ractiveDialog(
                        ResetPayPasswordForm,
                        {
                            title: '设置支付密码',
                            width: 540
                        },
                        {
                            mobile: userData.mobile,
                            sendVerifyCode: function () {
                                return homeService
                                .sendVerifyCode();
                            },
                            onNext: function (data) {
                                return homeService
                                .checkSms(data);
                            },
                            submit: function (data) {
                                return homeService
                                .resetPassword(data);
                            },
                            onSuccess: function () {
                                me.set({
                                    'options.hasPayPassword': true
                                });
                                dialog.dispose();
                                confirmByPayPassword();
                            }
                        }
                    );
                }

            };

            me.on('PayBankCardList.add', function () {
                bindBankCard(constant.BIND_TYPE_NEW_PAY);
            });
            me.on('WithdrawBankCardList.add', function () {
                bindBankCard(constant.BIND_TYPE_NEW_WITHDRAW);
            });
            me.on('WithdrawBankCardList.replace', function (data) {
                bindBankCard(constant.BIND_TYPE_EDIT_WITHDRAW);
            });
            me.on('PayBankCardList.remove', function (data) {
                removeBankCard(data, true);
            });
            me.on('WithdrawBankCardList.remove', function (data) {
                removeBankCard(data);
            });

            me.bindData({
                'payBankCardListOptions.list': 'options.payBankCardList',
                'withdrawBankCardListOptions.list': 'options.withdrawBankCardList'
            });

        }
    });

});