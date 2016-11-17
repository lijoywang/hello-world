/**
 * @file 收银台
 * @author niuxiaojing
 */
define(function (require, exports) {
    'use strict';

    var service = require('./service');

    var Validator = require('../common/custom/form/Validator');

    var urlUtil = require('cc/util/url');

    var ractiveDialog = require('../common/function/ractiveDialog');

    var simplifySecond = require('cc/function/simplifySecond');
    var Timer = require('cc/util/Timer');

    var PAY_KUAIJIE = 0;
    var PAY_YIJIAN = 1;
    var CASH_TYPE_CREDIT_CARD = 4;
    var CASH_TYPE_DEBIT_CARD = 5;
    var THIRD_PAY_TYPE_ZHIFUBAO = 2;
    var THIRD_PAY_TYPE_WEIXIN = 30;
    var THIRD_PAY_TYPE_WANGYIN = 0;


    exports.init = function () {

        var query = urlUtil.parseQuery(location.search);
        var userId = query.user_id;
        var purchaseId = query.purchase_id;
        var userRole = query.user_role;
        var resultUrl = query.jump_url;

        var validator = new Validator({
            mainElement: $('#app'),
            fields: {
                password: {
                    rules: {
                        required: true
                    },
                    errors: {
                        required: '请输入平台支付密码'
                    }
                },
                code: {
                    rules: {
                        required: true
                    },
                    errors: {
                        required: '请输入短信验证码'
                    }
                },
                cardCode: {
                    rules: {
                        required: true
                    },
                    errors: {
                        required: '请输入卡号后三位数字'
                    }
                }
            }
        });

        var instance = new Ractive({
            el: '#app',
            template: require('tpl!./checkout.html'),
            data: {

                bankInfoOptions: {
                    name: 'bank',
                    data: [ ],
                    value: 0
                },

                codeButtonOptions: {
                    text: '发送验证码',
                    className: 'code-button',
                    disabled: false,
                    countdown: false,
                    countdownText: '${second}秒后可再次发送',
                    countdownSecond: 60
                },

                passwordInputOptions: {
                    name: 'password',
                    value: '',
                    placeholder: '请输入支付密码',
                    className: 'password-input',
                    type: 'password'
                },

                codeInputOptions: {
                    name: 'code',
                    value: '',
                    placeholder: '请输入短信验证码',
                    className: 'code-input',
                    type: 'text'
                },
                cardCodeInputOptions: {
                    name: 'cardCode',
                    value: '',
                    placeholder: '请输入卡验证码',
                    className: 'code-input',
                    type: 'text'
                },
                supportedBankList: [],

                PAY_KUAIJIE: PAY_KUAIJIE,
                PAY_YIJIAN: PAY_YIJIAN,

                payMoney: '',
                purchaseId: '',
                hasPayPassword: true,
                thirdType: '',
                token: '',
                showSupportedBankList: false,

                showCountdown: '',
                restSeconds: '',
                restTime: '',
                thirdPayTypes: [],
                hasZhifubao: true,
                hasWeixin: true,
                hasWangyin: true,
                zhifubaoReturn: '',
                allPayReturn: ''

            },
            computed: {
                selectedCard: function () {
                    var index = this.get('bankInfoOptions.value');
                    return this.get('bankInfoOptions.data.' + index);
                }
            },
            components: {
                BankInfo: require('./component/BankInfo'),
                CodeButton: require('../common/component/CodeButton'),
                Input: require('../common/component/Input')
            },


            whetherDisplayPayType: function (type) {
                var thirdPayTypes = this.get('thirdPayTypes');
                if ($.inArray(type, thirdPayTypes) >= 0) {
                    return true;
                }
                return false;
            },

            culculateRestTime: function () {
                var me = this;
                var restSeconds = me.get('restSeconds');
                me.set('restSeconds', --restSeconds);
                if (restSeconds <= 0) {
                    me.set('restTime', '已过期');
                    return false;
                }
                var restTime = simplifySecond(restSeconds);
                var minutes = restTime.minutes;
                if (minutes.toString().length === 1) {
                    minutes = '0' + minutes;
                }
                var seconds = restTime.seconds;
                if (seconds.toString().length === 1) {
                    seconds = '0' + seconds;
                }
                var showStr = minutes + ':' + seconds;

                var hours = restTime.hours;
                if (hours != 0) {
                    if (hours.toString().length === 1) {
                        hours = '0' + hours;
                    }
                    showStr = hours + ':' + showStr;
                }
                var days = restTime.days;
                if (days != 0) {
                    showStr = days + '天 ' + showStr;
                }
                me.set('restTime', showStr);
                return true;

            },

            submit: function () {
                var me = this;

                if (!validator.validate()) {
                    return;
                }

                var data = {
                    user_id: userId,
                    user_role: userRole,
                    purchase_id: me.get('purchaseId'),
                    card_type: me.get('selectedCard.card_type'),
                    card_name: me.get('selectedCard.card_name'),
                    unique_id: me.get('selectedCard.unique_id'),
                    money: me.get('payMoney'),
                    bank_no: me.get('selectedCard.card_name')
                };

                var payFlag = me.get('selectedCard.pay_flag');

                data.cash_type = data.card_type === 'C'
                                                ? CASH_TYPE_CREDIT_CARD
                                                : CASH_TYPE_DEBIT_CARD;

                if (payFlag == PAY_KUAIJIE) {

                    var tradeCode = instance.get('codeInputOptions.value');
                    data.trade_code = tradeCode;
                    data.pay_type = '12:'+ instance.get('payMoney');
                    data.third_type = instance.get('thirdType');
                    data.token = instance.get('token');

                    if (data.card_type === 'C') {
                        data.cvv = instance.get('cardCodeInputOptions.value');
                    }
                }
                else if (payFlag == PAY_YIJIAN) {
                    var password = instance.get('passwordInputOptions.value');
                    data.password = password;
                    data.pay_type = '11:' + instance.get('payMoney');
                }

                service
                .submit(data)
                .then(function (response) {
                    if (!response.code) {
                        me.getPayResultOnce();
                    }
                });
            },

            zhifubaoPay: function () {
                var me = this;
                var data = {
                    user_id: userId,
                    purchase_id: purchaseId,
                    pay_type: '2:' + me.get('payMoney'),
                };
                $.extend(
                    data,
                    me.get('zhifubaoReturn'),
                    me.get('allPayReturn')
                );
                service
                .submit(data)
                .then(function (response) {
                    if (!response.code) {
                        var waitPay = require('./component/WaitPayResult');
                        waitPay.data.purchaseId = purchaseId;

                        var waitPayDialog = ractiveDialog(
                            $.extend(
                                {},
                                waitPay
                            )
                        );
                        waitPayDialog.once('beforehide', function () {
                            me.getPayResultOnce();
                        });
                        waitPayDialog.show();
                        window.open(response.data.pay_url);
                    }
                });
            },
            weixinPay: function () {
                var me = this;
                var data = {
                    user_id: userId,
                    purchase_id: purchaseId,
                    pay_type: '30:' + me.get('payMoney')
                };
                $.extend(data, me.get('allPayReturn'));
                service
                .submit(data)
                .then(function (response) {
                    if (!response.code) {
                        var payUrl = response.data.pay_url;

                        var wechatPay = require('./component/WechatPay');
                        wechatPay.data.url = payUrl;
                        wechatPay.data.payMoney = me.get('payMoney');

                        var wechatPayDialog = ractiveDialog(
                            $.extend({}, wechatPay)
                        );
                        wechatPayDialog.show();

                        me.getPayResult();

                        wechatPayDialog.once('beforehide', function () {
                            var timer = me.timer;
                            if (timer) {
                                timer.stop();
                            }
                        });

                    }
                });
            },
            getPayResult: function () {
                var me = this;
                var timer = me.timer;
                if (timer) {
                    timer.stop();
                }
                var Timer = require('cc/util/Timer');
                timer = new Timer({
                    task: function () {
                        service
                        .getPurchaseStatus({
                            purchase_id: purchaseId
                        })
                        .then(function (response) {
                            if (!response.code && response.data.status) {
                                timer.stop();
                                var win = window.parent || window;
                                win.postMessage({
                                    source: 'pay',
                                    status: 'success'
                                }, '*');
                            }
                        });
                    },
                    interval: 1000
                });
                timer.start();
                me.timer = timer;
            },
            getPayResultOnce: function () {
                service
                .getPurchaseStatus({
                    purchase_id: purchaseId
                })
                .then(function (response) {
                    if (!response.code && response.data.status) {
                        var win = window.parent || window;
                        win.postMessage({
                            source: 'pay',
                            status: 'success'
                        }, '*');
                    }
                });
            },
            getBankList: function () {
                var me = this;
                service
                .getBankList({})
                .then(function (response) {
                    if (!response.code) {
                        instance.set('supportedBankList', response.data);
                        var selectBank = require('./component/SelectBank');
                        selectBank.data.supportedBankList = instance.get('supportedBankList');
                        selectBank.data.payMoney = instance.get('payMoney');
                        selectBank.data.userId = userId;
                        selectBank.data.purchaseId = purchaseId;
                        selectBank.data.getPayResultOnce = me.getPayResultOnce;
                        var selectBankDialog = ractiveDialog(
                            $.extend({}, selectBank));
                        selectBankDialog.show();
                    }
                });
            },
            sendCode: function () {
                var cardType = instance.get('selectedCard.card_type');
                service
                .sendCode({
                    purchase_id: purchaseId,
                    money: instance.get('payMoney'),
                    card_name: instance.get('selectedCard.card_name'),
                    card_type: cardType,
                    user_id: userId,
                    unique_id: instance.get('selectedCard.unique_id'),
                    cash_type: cardType === 'C' ? CASH_TYPE_CREDIT_CARD
                                                : CASH_TYPE_DEBIT_CARD
                })
                .then(function (response) {
                    if (!response.code) {
                        var response = response.data;
                        var data = {
                            'codeButtonOptions.countdown': true,
                            thirdType: response.third_type,
                            token: response.token
                        }
                        instance.set(data);
                    }
                });
            }

        });

        service
        .payProductPurchase({
            user_id: userId,
            purchase_id: purchaseId,
            jump_url: resultUrl,
            render: 'json'
        })
        .then(function (response) {
            var data = response.data;
            var extraInfo = data.extra_info;
            var thirdPayParams = data.third_pay_params;

            var batchData = {
                purchaseId: data.purchase_id,
                payMoney: data.need_pay_money,
                hasPayPassword: !!data.has_passwd,
                restSeconds: extraInfo ? extraInfo.ttl : '',
                showCountdown: extraInfo ? extraInfo.show_ttl : '',
                thirdPayTypes: extraInfo ? extraInfo.third_pay_types : '',
            };
            batchData['bankInfoOptions.data'] = data.bank_info;
            if (thirdPayParams && thirdPayParams[2]) {
                batchData.zhifubaoReturn = thirdPayParams[2];
            }
            if (thirdPayParams && thirdPayParams.all) {
                batchData.allPayReturn = thirdPayParams.all;
            }
            instance.set(batchData);

            // 倒计时
            var timer =
            instance.timer = new Timer({
                task: function () {
                    if (!instance.culculateRestTime()) {
                        timer.stop();
                        return false;
                    }
                },
                interval: 1000
            });

            if (instance.culculateRestTime()) {
                timer.start();
            }

            // 如果是支付方式自定义模式，判断显示哪些第三方支付方式
            if (extraInfo && extraInfo.template == 'custom') {
                instance.set({
                    hasZhifubao: instance.whetherDisplayPayType(THIRD_PAY_TYPE_ZHIFUBAO),
                    hasWeixin: instance.whetherDisplayPayType(THIRD_PAY_TYPE_WEIXIN),
                    hasWangyin: instance.whetherDisplayPayType(THIRD_PAY_TYPE_WANGYIN)
                });
            }
        });

    };

});
