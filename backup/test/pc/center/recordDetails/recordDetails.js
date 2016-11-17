/**
 * @file 交易明细
 * @author niuxiaojing
 */
define(function (require, exports, module) {

    'use strict';

    var service = require('./service');
    var constant = require('../common/constant');
    var urlUtil = require('cc/util/url');
    var moment = require('moment');

    var formatStartTime = function (startTime) {
        return startTime ? moment(startTime, 'YYYY/MM/DD')
                           .add(0, 'h').add(0, 'm').add(0, 's')
                           .format('YYYY-MM-DD HH:mm:ss')
                         : startTime;
    };
    var formatEndTime = function (endTime) {
        return endTime ? moment(endTime, 'YYYY/MM/DD')
                         .add(23, 'h').add(59, 'm').add(59, 's')
                         .format('YYYY-MM-DD HH:mm:ss')
                       : endTime;
    };

    return Ractive.extend({
        template: require('tpl!./recordDetails.html'),
        data: function () {
            var me = this;
            return {
                style: require('text!./recordDetails.styl'),

                SUBTAB_TRADE_RECORD: constant.SUBTAB_TRADE_RECORD,
                SUBTAB_BALANCE_RECORD: constant.SUBTAB_BALANCE_RECORD,

                navigatorOptions: {
                    list: [
                        {
                            label: '交易记录',
                            onClick: function () {
                                me.set('options.recordType', constant.SUBTAB_TRADE_RECORD);
                            }
                        },
                        {
                            label: '余额收支明细',
                            onClick: function () {
                                me.set('options.recordType', constant.SUBTAB_BALANCE_RECORD);
                            }
                        }
                    ],
                    selectedIndex: 0
                },
                filterBarOptions: {
                    userRole: userData.role,
                    startTime: '',
                    endTime: '',
                    teacherId: '',
                    allTeachers: '',
                    income: '',
                    loadRecord: function () {
                        me.set('pagerOptions.page', 0);
                        me.loadRecord();
                    },
                    exportData: function () {
                        me.exportData();
                    }
                },
                tradeTableOptions: {
                    list: ''
                },
                balanceTableOptions: {
                    list: ''
                },
                pagerOptions: {
                    page: 0,
                    count: 0
                },

                options: {
                    recordType: null,
                }
            };
        },
        components: {
            Navigator: require('../component/Navigator'),
            FilterBar: require('./component/FilterBar'),
            TradeTable: require('./component/TradeTable'),
            BalanceTable: require('./component/BalanceTable'),
            Pager: require('../../common/component/Pager')
        },

        oncomplete: function () {
            var me = this;

            var type = layoutInstance.get('sub_tab');
            var typeArray = [
                constant.SUBTAB_TRADE_RECORD,
                constant.SUBTAB_BALANCE_RECORD
            ];
            if ($.inArray(type, typeArray) >= 0) {
                me.set('options.recordType', type);
            }
            else {
                me.set('options.recordType', constant.SUBTAB_TRADE_RECORD);
            }


            me.observe('pagerOptions.page', function (page) {
                if (page >= 0) {
                    me.loadRecord();
                }
            });


            me.observe('options.recordType', function (type) {

                if (me.get('pagerOptions.page') > 1) {
                    me.set('pagerOptions.page', 1);
                }
                else {
                    me.loadRecord();
                }
                // 同步url
                if (type == constant.SUBTAB_TRADE_RECORD) {
                    location.href = urlUtil.mixin(
                        {sub_tab: constant.SUBTAB_TRADE_RECORD},
                        true
                    );
                    me.set('navigatorOptions.selectedIndex', 0);
                }
                else if (type == constant.SUBTAB_BALANCE_RECORD) {
                    location.href = urlUtil.mixin(
                        {sub_tab: constant.SUBTAB_BALANCE_RECORD},
                        true
                    );
                    me.set('navigatorOptions.selectedIndex', 1);
                }
            });

            if (userData.isInstitution) {
                me.getOrgTeachers();
            }

        },

        loadRecord: function () {
            var me = this;

            var page = me.get('pagerOptions.page');
            var recordType = me.get('options.recordType');
            var startTime = formatStartTime(me.get('filterBarOptions.startTime'));
            var endTime = formatEndTime(me.get('filterBarOptions.endTime'));
            var teacherId = me.get('filterBarOptions.teacherId');
            var pageSize = 20;

            if (page > 0) {}
            else {
                me.set('pagerOptions.page', 1);
                return;
            }

            if (recordType === constant.SUBTAB_TRADE_RECORD) {
                service
                .getTradeRecord({
                    page: page,
                    pageSize: pageSize,
                    startTime: startTime,
                    endTime: endTime,
                    teacherId: teacherId
                })
                .then(function (response) {
                    var data = response.data;
                    var size = data.total;

                    me.set({
                        'tradeTableOptions.list': data.records,
                        'pagerOptions.count': Math.ceil(size / pageSize),
                        'filterBarOptions.income': data.sum
                    });
                });
            }
            else if (recordType === constant.SUBTAB_BALANCE_RECORD) {
                service
                .getBalanceRecord({
                    page: page,
                    pageSize: pageSize,
                    startTime: startTime,
                    endTime: endTime,
                    teacherId: teacherId
                })
                .then(function (response) {
                    var data = response.data;
                    var size = data.total;

                    me.set({
                        'balanceTableOptions.list': data.records,
                        'pagerOptions.count': Math.ceil(size / pageSize),
                        'filterBarOptions.income': data.sum
                    });
                });
            }

        },
        getOrgTeachers: function () {
            var me = this;
            service
            .getOrgTeachers()
            .then(function (response) {
                me.set({
                    'filterBarOptions.allTeachers': response.data
                });
            });
        },
        exportData: function () {
            var me = this;

            var recordType = me.get('options.recordType');
            var startTime = formatStartTime(me.get('filterBarOptions.startTime'));
            var endTime = formatEndTime(me.get('filterBarOptions.endTime'));
            var teacherId = me.get('filterBarOptions.teacherId');

            var exportUrl;
            var params = {
                start_time: startTime,
                end_time: endTime
            };
            if (teacherId) {
                params.teacher_id = teacherId;
            }

            if (recordType === constant.SUBTAB_TRADE_RECORD) {
                exportUrl = '/wallet/exportTradeRecord?' + $.param(params);
            }
            else if (recordType === constant.SUBTAB_BALANCE_RECORD) {
                exportUrl = '/wallet/exportBalanceRecord?' + $.param(params);
            }

            window.open(exportUrl);
        }

    });

});