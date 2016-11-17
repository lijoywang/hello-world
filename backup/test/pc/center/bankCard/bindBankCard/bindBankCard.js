/**
 * @file 绑卡
 * @author zhujialu
 */
define(function (require, exports, module) {

    'use strict';

    var service = require('../service');
    var constant = require('../constant');
    var config = require('../../common/config');

    var urlUtil = require('cc/util/url');

    return Ractive.extend({
        template: require('tpl!./bindBankCard.html'),
        data: function () {
            return {
                style: require('text!./bindBankCard.styl'),

                hasAccountType: false,
                acceptAgreement: null,
                bindSuccess: false,
                submiting: false,
                agreementUrl: config.roleUrl[userData.role].agreementUrl,

                ACCOUNT_TYPE_PERSON: constant.ACCOUNT_TYPE_PERSON,
                ACCOUNT_TYPE_COMPANY: constant.ACCOUNT_TYPE_COMPANY,

                BIND_TYPE_NEW_PAY: constant.BIND_TYPE_NEW_PAY,
                BIND_TYPE_NEW_WITHDRAW: constant.BIND_TYPE_NEW_WITHDRAW,
                BIND_TYPE_EDIT_WITHDRAW: constant.BIND_TYPE_EDIT_WITHDRAW,

                accountTypeSelectorOptions: {
                    value: constant.ACCOUNT_TYPE_PERSON
                },

                options: {
                    bindType: null,
                    accountType: constant.ACCOUNT_TYPE_PERSON,
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
                        bankNumber: '',
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
                        onComplete: $.noop
                    }
                }
            };
        },
        components: {
            AccountTypeSelector: require('../component/AccountTypeSelector'),
            CompanyBindBankCardForm: require('../component/CompanyBindBankCardForm'),
            PersonBindBankCardForm: require('../component/PersonBindBankCardForm'),
            BindBankCardSuccess: require('../component/BindBankCardSuccess')
        },
        computed: {
            needServiceAgreement: function () {
                return this.get('options.bindType') == constant.BIND_TYPE_NEW_PAY;
            }
        },
        oncomplete: function () {
            var me = this;

            // 标识是传进来的还是选择的
            var hasAccountType = !!me.get('options.accountType');
            me.set('hasAccountType', hasAccountType);

            if (hasAccountType) {
                me.syncBindType();
            }

            me.observe(
                'options.personBindBankCardFormOptions.needBindForce',
                function (needBindForce) {
                    if (needBindForce) {
                        confirm({
                            title: '提示',
                            content: '您填写的银行卡信息验证不成功，'
                                + '可能会导致提现失败，是否继续绑定银行卡？',
                            buttons: [
                                {
                                    text: '是',
                                    type: 'primary',
                                    action: function () {
                                        this.hide();
                                        me.submitPersonBindBankCardFormForce();
                                    }
                                },
                                {
                                    text: '否',
                                    action: function () {
                                        this.hide();
                                    }
                                }
                            ]
                        });
                    }
                }
            );
        },
        submitAccountType: function () {
            this.set(
                'options.accountType',
                this.get('accountTypeSelectorOptions.value')
            );
            this.syncBindType();
        },
        syncBindType: function () {
            var me = this;
            var accountType = me.get('options.accountType');

            var key;
            if (accountType == constant.ACCOUNT_TYPE_PERSON) {
                key = 'options.personBindBankCardFormOptions';
            }
            else if (accountType == constant.ACCOUNT_TYPE_COMPANY) {
                key = 'options.companyBindBankCardFormOptions';
            }

            if (key) {
                me.set(
                    key + '.bindType',
                    me.get('options.bindType')
                );
            }

        },
        showAccountType: function () {
            this.set(
                'options.accountType',
                ''
            );
        },
        submitPersonBindBankCardFormForce: function () {

            var me = this;
            var keypath = 'options.personBindBankCardFormOptions';

            service
            .bindBankCardForce({
                userName: me.get(keypath + '.userName'),
                userId: me.get(keypath + '.userId'),
                userMobile: me.get(keypath + '.userMobile'),
                bankCardNumber: me.get(keypath + '.bankCardNumber'),
                bankNumber: me.get(keypath + '.bankNumber'),
                province: me.get(keypath + '.bankLocation.province'),
                city: me.get(keypath + '.bankLocation.city')
            })
            .then(function () {
                me.set({
                    bindSuccess: true
                });
            });
        },
        submitPersonBindBankCardForm: function () {
            var me = this;
            var component = me.findComponent('PersonBindBankCardForm');
            if (component.validate()) {
                var error;
                var keypath = 'options.personBindBankCardFormOptions';

                var token = me.get(keypath + '.token');
                var verifyCode = me.get(keypath + '.verifyCode');

                if (me.get('needServiceAgreement')
                    && !me.get('acceptAgreement')
                ) {
                    error = '绑卡需先同意服务协议';
                }
                else if (!token) {
                    error = '请获取验证码';
                }
                if (error) {
                    tip({
                        type: 'error',
                        content: error
                    });
                    return;
                }

                me.set('submiting', true);

                service
                .bindBankCardVerify({
                    token: token,
                    verifyCode: verifyCode
                })
                .then(function (response) {
                    me.set({
                        bindSuccess: true
                    });
                })
                .always(function () {
                    me.set({
                        submiting: false
                    });
                });
            }
        },
        submitCompanyBindBankCardForm: function () {
            var me = this;
            var component = me.findComponent('CompanyBindBankCardForm');
            if (component.validate()) {
                me.set('submiting', true);
                var data = me.get('options.companyBindBankCardFormOptions');
                service
                .bindCompanyBankCard({
                    companyName: data.companyName,
                    bankNumber: data.bankNumber,
                    bankCardNumber: data.bankCardNumber,
                    province: data.bankLocation.province,
                    city: data.bankLocation.city
                })
                .then(
                    function (response) {
                        me.set({
                            bindSuccess: true,
                            submiting: false
                        });
                    },
                    function () {
                        me.set({
                            submiting: false
                        });
                    }
                );
            }
        }
    });

});