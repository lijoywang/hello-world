/**
 * @file 日期输入框选择
 * @author zhujialu
 */
define(function (require, exports, module) {

    'use strict';

    var FormDate = require('../custom/form/Date');
    var parseDate = require('cc/function/parseDate');
    var simplifyDate = require('cc/function/simplifyDate');
    var offsetMonth = require('cc/function/offsetMonth');

    return Ractive.extend({
        template: require('tpl!./DatePicker.html'),
        data: function () {
            var today = simplifyDate(new Date());
            return {
                style: require('text!./DatePicker.styl'),
                dateSelectOptions: {
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
                    name: '',
                    value: '',
                    placeholder: '',
                    className: '',
                    disabled: false,
                    readonly: false,
                    autofocus: false,
                    // Date 类型
                    disableBefore: null,
                    // Date 类型
                    disableAfter: null
                }
            };
        },
        components: {
            Input: require('./Input'),
            DateSelect: require('./DateSelect')
        },
        oncomplete: function () {
            var me = this;
            me.formDate = new FormDate({
                mainElement: $(me.getElement()),
                disableBefore: me.get('options.disableBefore'),
                disableAfter: me.get('options.disableAfter'),
                watch: {
                    value: function (value) {
                        me.set('options.value', value);
                    }
                }
            });
            me.observe('options.value', function (value) {
                me.formDate.set('value', value);
            });
            me.observe('options.disableBefore', function (disableBefore) {
                me.formDate.option('disableBefore', disableBefore);
                me.formDate.render();
            });
            me.observe('options.disableAfter', function (disableAfter) {
                me.formDate.option('disableAfter', disableAfter);
                me.formDate.render();
            });

            var updateCalendar = function () {
                var year = me.get('dateSelectOptions.year.value');
                var month = me.get('dateSelectOptions.month.value');
                if (year && month) {
                    me.formDate.inner('calendar').set('date', parseDate(year, month, 1));
                }
            };
            me.observe('dateSelectOptions.year.value', updateCalendar);
            me.observe('dateSelectOptions.month.value', updateCalendar);
        },
        onteardown: function () {
            this.formDate.dispose();
        },
        prev: function () {
            var calendar = this.formDate.inner('calendar');
            var date = simplifyDate(
                offsetMonth(calendar.get('date'), -1)
            );
            this.set({
                'dateSelectOptions.year.value': date.year,
                'dateSelectOptions.month.value': date.month
            });
        },
        next: function () {
            var calendar = this.formDate.inner('calendar');
            var date = simplifyDate(
                offsetMonth(calendar.get('date'), 1)
            );
            this.set({
                'dateSelectOptions.year.value': date.year,
                'dateSelectOptions.month.value': date.month
            });
        }
    });

});