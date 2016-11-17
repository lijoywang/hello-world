/**
 * @file 日期范围选择器
 * @author zhujialu
 */
define(function (require, exports, module) {

    'use strict';

    var split = require('cc/function/split');
    var parseDate = require('cc/function/parseDate');
    var simplifyDate = require('cc/function/simplifyDate');
    var offsetMonth = require('cc/function/offsetMonth');
    var DateRange = require('../custom/form/DateRange');

    return Ractive.extend({

        template: require('tpl!./DateRange.html'),

        data: function () {
            var today = simplifyDate(new Date());
            return {
                style: require('text!./DateRange.styl'),
                startDateSelectOptions: {
                    year: {
                        name: 'year',
                        value: today.year,
                        className: 'year-select',
                        min: '1900',
                        max: '2100',
                        defaultText: '年'
                    },
                    month: {
                        name: 'month',
                        value: today.month,
                        className: 'month-select',
                        defaultText: '月'
                    }
                },
                endDateSelectOptions: {
                    year: {
                        name: 'year',
                        value: today.year,
                        className: 'year-select',
                        min: '1900',
                        max: '2100',
                        defaultText: '年'
                    },
                    month: {
                        name: 'month',
                        value: today.month,
                        className: 'month-select',
                        defaultText: '月'
                    }
                },
                options: {
                    start: '',
                    end: '',
                    name: '',
                    placeholder: '',
                    readonly: ''
                }
            };
        },

        components: {
            Input: require('./Input'),
            DateSelect: require('./DateSelect')
        },

        computed: {
            separator: function () {
                return DateRange.defaultOptions.separator;
            },
            value: {
                get: function () {
                    var me = this;
                    var start = me.get('options.start');
                    var end = me.get('options.end');
                    if (start && end) {
                        return start
                            + me.get('separator')
                            + end;
                    }
                    return '';
                },
                set: function (value) {
                    var me = this;
                    var terms = split(value, me.get('separator'));
                    me.set({
                        'options.start': terms[0] || '',
                        'options.end': terms[1] || ''
                    });
                }
            }
        },

        oncomplete: function () {

            var me = this;

            me.dateRange = new DateRange({
                mainElement: $(me.getElement()),
                value: me.get('value'),
                watch: {
                    value: function (value) {
                        me.set('value', value);
                    }
                }
            });

            me.observe('options.start', function (start) {
                me.dateRange.set({
                    value: me.get('value')
                });
            });
            me.observe('options.end', function (end) {
                me.dateRange.set({
                    value: me.get('value')
                });
            });


            var updateStartCalendar = function () {
                var year = me.get('startDateSelectOptions.year.value');
                var month = me.get('startDateSelectOptions.month.value');
                if (year && month) {
                    me.dateRange.inner('startCalendar').set('date', parseDate(year, month, 1));
                }
            };
            me.observe('startDateSelectOptions.year.value', updateStartCalendar);
            me.observe('startDateSelectOptions.month.value', updateStartCalendar);

            var updateEndCalendar = function () {
                var year = me.get('endDateSelectOptions.year.value');
                var month = me.get('endDateSelectOptions.month.value');
                if (year && month) {
                    me.dateRange.inner('endCalendar').set('date', parseDate(year, month, 1));
                }
            };
            me.observe('endDateSelectOptions.year.value', updateEndCalendar);
            me.observe('endDateSelectOptions.month.value', updateEndCalendar);
        },

        onteardown: function () {
            this.dateRange.dispose();
        },

        prevStart: function () {
            var calendar = this.dateRange.inner('startCalendar');
            var date = simplifyDate(
                offsetMonth(calendar.get('date'), -1)
            );
            this.set({
                'startDateSelectOptions.year.value': date.year,
                'startDateSelectOptions.month.value': date.month
            });
        },
        nextStart: function () {
            var calendar = this.dateRange.inner('startCalendar');
            var date = simplifyDate(
                offsetMonth(calendar.get('date'), 1)
            );
            this.set({
                'startDateSelectOptions.year.value': date.year,
                'startDateSelectOptions.month.value': date.month
            });
        },

        prevEnd: function () {
            var calendar = this.dateRange.inner('endCalendar');
            var date = simplifyDate(
                offsetMonth(calendar.get('date'), -1)
            );
            this.set({
                'endDateSelectOptions.year.value': date.year,
                'endDateSelectOptions.month.value': date.month
            });
        },
        nextEnd: function () {
            var calendar = this.dateRange.inner('endCalendar');
            var date = simplifyDate(
                offsetMonth(calendar.get('date'), 1)
            );
            this.set({
                'endDateSelectOptions.year.value': date.year,
                'endDateSelectOptions.month.value': date.month
            });
        }

    });

});