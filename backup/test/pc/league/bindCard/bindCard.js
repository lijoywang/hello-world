/**
 * @file 绑定银行卡
 * @author zhujialu
 */
define(function (require, exports, module) {

    'use strict';

    var service = require('../service');
    var Validator = require('../../common/custom/form/Validator');
    var urlUtil = require('cc/util/url');

    var TYPE_PERSON = 1;
    var TYPE_COMPANY = 2;

    exports.init = function () {

        var bindCardData = { };

        var query = urlUtil.parseQuery(location.search);
        var leagueId = query.league_id;

        var instance = new Ractive({
            el: '#container',
            template: require('tpl!./bindCard.html'),
            data: {
                submiting: false,
                typeBoxGroupOptions: {
                    name: 'type',
                    value: 1,
                    data: [
                        {
                            value: TYPE_PERSON,
                            text: '个人'
                        },
                        {
                            value: TYPE_COMPANY,
                            text: '企业'
                        }
                    ]
                },
                companyInputOptions: {
                    name: 'company',
                    value: '',
                    className: 'company-input'
                },
                nameInputOptions: {
                    name: 'name',
                    value: '',
                    className: 'name-input'
                },
                idInputOptions: {
                    name: 'id',
                    value: '',
                    className: 'id-input'
                },
                bankSelectOptions: {
                    name: 'bank',
                    className: 'bank-select',
                    defaultText: '请选择',
                    data: null,
                    value: ''
                },
                cardNumInputOptions: {
                    name: 'cardNum',
                    value: '',
                    className: 'card-num-input'
                },
                regionOptions: {
                    className: 'bank-region',
                    province: {
                        name: 'province',
                        value: '',
                        data: null,
                        defaultText: '- 省 -'
                    },
                    city: {
                        name: 'city',
                        value: '',
                        data: null,
                        defaultText: '- 市 -'
                    }
                },
                mobileInputOptions: {
                    name: 'mobile',
                    value: '',
                    className: 'mobile-input'
                },
                codeInputOptions: {
                    name: 'code',
                    value: '',
                    className: 'code-input'
                },
                codeButtonOptions: {
                    text: '获取验证码',
                    disabled: false,
                    countdown: false,
                    countdownText: '${second} 秒后可再次发送',
                    countdownSecond: 60
                }
            },
            components: {
                Input: require('../../common/component/Input'),
                Select: require('../../common/component/Select'),
                BoxGroup: require('../../common/component/BoxGroup'),
                AddressSelect: require('../../common/component/AddressSelect'),
                CodeButton: require('../../common/component/CodeButton')
            },
            onrender: function () {

                var me = this;

                var container = $(me.getElement());

                me.validator = new Validator({
                    mainElement: container,
                    fields: {
                        company: {
                            rules: {
                                required: true,
                                pattern: 'char'
                            },
                            errors: {
                                required: '请输入企业开户名称',
                                pattern: '请输入正确的格式'
                            }
                        },
                        name: {
                            rules: {
                                required: true,
                                pattern: 'char'
                            },
                            errors: {
                                required: '请输入持卡人姓名',
                                pattern: '请输入正确的格式'
                            }
                        },
                        id: {
                            rules: {
                                required: true
                            },
                            errors: {
                                required: '请输入身份证号'
                            }
                        },
                        bank: {
                            rules: {
                                required: true
                            },
                            errors: {
                                required: '请选择开户银行'
                            }
                        },
                        cardNum: {
                            rules: {
                                required: true
                            },
                            errors: {
                                required: '请输入银行卡号'
                            }
                        },
                        mobile: {
                            rules: {
                                required: true,
                                pattern: 'mobile'
                            },
                            errors: {
                                required: '请输入手机号',
                                pattern: '手机格式错误'
                            }
                        },
                        province: {
                            rules: {
                                required: true,
                            },
                            errors: {
                                required: '请选择省份'
                            }
                        },
                        city: {
                            before: function (data) {
                                if (!data.province.value) {
                                    return false;
                                }
                            },
                            rules: {
                                required: true,
                            },
                            errors: {
                                required: '请选择城市'
                            }
                        },
                        code: {
                            rules: {
                                required: true
                            },
                            errors: {
                                required: '请输入手机验证码'
                            }
                        }
                    }
                });

                me.observe('typeBoxGroupOptions.value', function () {
                    me.set('codeButtonOptions.countdown', false);
                });

                me.on('sendSMS', function () {

                    var fields = [
                        'bank', 'cardNum', 'name', 'id', 'mobile'
                    ];

                    if (me.validator.validate(fields)) {
                        service
                        .sendSMS({
                            leagueId: leagueId,
                            bankNo: me.get('bankSelectOptions.value'),
                            cardNum: me.get('cardNumInputOptions.value'),
                            ownerId: me.get('idInputOptions.value'),
                            ownerName: me.get('nameInputOptions.value'),
                            ownerMobile: me.get('mobileInputOptions.value')
                        })
                        .then(function (response) {
                            $.extend(bindCardData, response.data);
                            me.set('codeButtonOptions.countdown', true);
                        });
                    }

                });

            },

            bindCard: function () {

                var me = this;

                if (me.validator.validate()) {

                    var data = {
                        leagueId: leagueId,

                        bankNo: me.get('bankSelectOptions.value'),
                        cardNum: me.get('cardNumInputOptions.value'),
                        companyName: me.get('companyInputOptions.value'),
                        ownerId: me.get('idInputOptions.value'),
                        ownerName: me.get('nameInputOptions.value'),
                        ownerMobile: me.get('mobileInputOptions.value'),
                        region: me.get('regionOptions.province.value')
                              + '_'
                              + me.get('regionOptions.city.value'),

                        purchaseId: bindCardData.purchase_id,
                        thirdType: bindCardData.third_type,
                        token: bindCardData.token,
                        smsCode: me.get('codeInputOptions.value')
                    };

                    var success = function () {
                        tip({
                            type: 'success',
                            content: '绑定成功'
                        })
                        .then(function () {
                            location.href = '/league/overview?' + $.param(query);
                        });
                    };
                    var done = function () {
                        me.set('submiting', false);
                    };

                    me.set('submiting', true);

                    if (me.get('typeBoxGroupOptions.value') == TYPE_COMPANY) {
                        service
                        .bindCardForCompany(data)
                        .then(success)
                        .always(done);
                    }
                    else {
                        service
                        .bindCardForPerson(data)
                        .then(success)
                        .always(done);
                    }

                }

            }
        });

        service
        .getSupportBankList()
        .then(function (response) {

            var data = $.map(
                response.data.bank_list,
                function (item) {
                    return {
                        text: '<img src="'
                            + item.icon_url
                            + '" />'
                            + item.name,
                        value: item.code
                    }
                }
            );

            instance.set('bankSelectOptions.data', data);

        });

    };

});