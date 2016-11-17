/**
 * @file 资金明细
 * @author zhujialu
 */
define(function (require, exports, module) {

    'use strict';

    var service = require('../service');
    var urlUtil = require('cc/util/url');

    var WithdrawRequestDialog = require('../component/WithdrawRequestDialog');

    exports.init = function () {

        var query = urlUtil.parseQuery(location.search);
        var leagueId = query.league_id;

        var instance = new Ractive({
            el: '#container',
            template: require('tpl!./overview.html'),
            data: {
                leagueId: leagueId || '',
                accountMobile: query.account_mobile || '',
                card: null,
                balance: 0,
                drawcash: 0,
                incomeWeek: 0,
                incomeMonth: 0,
                income: 0,

                showDrawCashAction: false
            },
            components: {
                RecordDetail: require('../component/RecordDetail')
            },
            unbindCard: function () {
                confirm({
                    title: '温馨提示',
                    content: '确定要解绑该银行卡吗？'
                })
                .then(function () {
                    service
                    .unbindCard({
                        leagueId: leagueId
                    })
                    .then(function () {
                        tip({
                            type: 'success',
                            content: '解绑成功'
                        })
                        .then(function () {
                            location.reload();
                        });
                    });
                });
            },
            withdraw: function () {

                if (instance.get('balance') == 0) {
                    alert({
                        title: '温馨提示',
                        content: '余额不足，无法提现'
                    });
                    return;
                }

                var search = $.param(query);

                if (instance.get('card')) {
                    new WithdrawRequestDialog({
                        leagueId: leagueId,
                        onsuccess: function () {
                            tip({
                                type: 'success',
                                content: '申请成功，正在前往提现'
                            })
                            .then(function () {
                                location.href = '/league/withdraw?' + search;
                            });
                        }
                    });
                }
                else {
                    confirm({
                        type: 'primary',
                        title: '提示',
                        content: '为保证你的资金安全，请绑定你本人的储蓄卡进行提现。如果疑问，请拨打客服热线 4000-910-910。',
                        width: 380,
                        buttons: [
                            {
                                type: 'primary',
                                text: '绑定银行卡',
                                action: function () {
                                    location.href = '/league/bindCard?' + search;
                                }
                            }
                        ]
                    });
                }

            }
        });

        service
        .getLeagueAccountDrawCashSwitch({
            leagueId: leagueId
        })
        .then(function (response) {

            var data = response.data;

            instance.set({
                showDrawCashAction: data.status === 1
            });

        });

        service
        .getLeagueAccountDetail({
            leagueId: leagueId
        })
        .then(function (response) {
            var data = response.data;
            instance.set({
                balance: data.balance,
                drawcash: data.drawcash,
                incomeWeek: data.income_week,
                incomeMonth: data.income_month,
                income: data.income
            });
        });

        service
        .getAccountCardList({
            leagueId: leagueId
        })
        .then(function (response) {
            var card = response.data.card_list[0];
            instance.set('card', card);
        });

    };

});