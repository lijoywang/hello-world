/**
 * @file 资金明细
 * @author zhujialu
 */
define(function (require, exports, module) {

    'use strict';

    var service = require('../service');
    var urlUtil = require('cc/util/url');

    var moment = require('moment');

    var firstDateInMonth = require('cc/function/firstDateInMonth');
    var lastDateInMonth = require('cc/function/lastDateInMonth');

    var today = new Date();

    return Ractive.extend({
        template: require('text!./RecordDetail.html'),
        data: function () {
            return {
                records: [ ],
                size: -1,
                pagerOptions: {
                    page: 0,
                    count: 0
                },
                dateRangeOptions: {
                    start: moment(firstDateInMonth(today)).format('YYYY/MM/DD'),
                    end: moment(lastDateInMonth(today)).format('YYYY/MM/DD'),
                    name: 'dateRange',
                    placeholder: '请选择开始和结束时间'
                }
            };
        },
        components: {
            Pager: require('../../common/component/Pager'),
            DateRange: require('../../common/component/DateRange')
        },
        onrender: function () {
            var me = this;
            me.observe(
                'pagerOptions.page',
                function (page) {
                    if (page > 0) {
                        me.request();
                    }
                }
            );
            me.search();
        },
        search: function () {

            var me = this;

            if (me.get('pagerOptions.page') == 1) {
                me.request();
            }
            else {
                me.set('pagerOptions.page', 1);
            }

        },
        request: function () {

            var me = this;

            var pageSize = 10;
            var leagueId = urlUtil.parseQuery(location.search).league_id;

            service
            .getLeagueAccountRecordDetail({
                leagueId: leagueId,
                startTime: me.get('dateRangeOptions.start'),
                endTime: me.get('dateRangeOptions.end'),
                page: me.get('pagerOptions.page'),
                pageSize: pageSize
            })
            .then(function (response) {

                var data = response.data;
                var size = data.total;

                me.set({
                    size: size,
                    records: data.records,
                    'pagerOptions.count': Math.ceil(size / pageSize)
                });

            });

        }
    });

});