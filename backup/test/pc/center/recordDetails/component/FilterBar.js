/**
 * @file 过滤工具条
 * @author niuxiaojing
 */
define(function (require, exports, module) {

    'use strict';

    var moment = require('moment');

    var firstDateInMonth = require('cc/function/firstDateInMonth');
    var lastDateInMonth = require('cc/function/lastDateInMonth');

    var Popup = require('../../../common/custom/helper/Popup');

    var constant = require('../../common/constant');

    var today = new Date();

    var teacherGroup = [
        'ABCD',
        'EFGH',
        'JKLM',
        'NOPQRS',
        'TUVWX',
        'YZ'
    ];
    var ALL_VALUE = -1;
    var ALL_TEXT = '全部';

    return Ractive.extend({
        template: require('tpl!./FilterBar.html'),
        data: function () {
            return {
                style: require('text!./FilterBar.styl'),
                USER_ROLE_INSTITUTION: constant.USER_ROLE_INSTITUTION,
                teacherGroup: teacherGroup,
                teacherName: ALL_TEXT,
                groupIndex: ALL_VALUE,
                options: {
                    userRole: '',
                    startTime: '',
                    endTime: '',
                    teacherId: '',

                    allTeachers: {},
                    loadRecord: $.noop
                },
                dateRangeOptions: {
                    start: '',
                    end: '',
                    name: 'dateRange',
                    placeholder: '请选择开始和结束时间',
                    readonly: true
                }
            }
        },
        computed: {
            teacherList: function () {
                var me = this;
                var allTeachers = me.get('options.allTeachers');

                var teacherList = [];
                var pushTeacherList = function (index, item) {
                    teacherList.push(item);
                };

                var groupIndex = me.get('groupIndex');
                if (groupIndex == ALL_VALUE) {
                    $.each(allTeachers, function (name, value) {
                        $.each(value, pushTeacherList);
                    });
                }
                else {
                    var group = teacherGroup[groupIndex].split('');
                    $.each(allTeachers, function (name, value) {
                        if ($.inArray(name, group) >= 0) {
                            $.each(value, pushTeacherList);
                        }
                    });
                }

                return teacherList;
            }
        },
        components: {
            DateRange: require('../../../common/component/DateRange')
        },

        oncomplete: function () {

            var me = this;
            me.bindData({
                'dateRangeOptions.start': 'options.startTime',
                'dateRangeOptions.end': 'options.endTime'
            });

            var container = $(me.getElement());
            var teacherElement = container.find('input.teacher');
            if (teacherElement.length === 1) {
                me.popup = new Popup({
                    triggerElement: teacherElement,
                    layerElement: container.find('.teachers')
                });
            }
        },
        onteardown: function () {
            if (this.popup) {
                this.popup.dispose();
            }
        },

        selectTeacher: function (item) {
            var data = {};
            if (!item) {
                data.teacherName = ALL_TEXT;
                data['options.teacherId'] = '';
                data.groupIndex = -1;
            }
            else {
                this.popup.close();
                data.teacherName = item.user_name;
                data['options.teacherId'] = item.user_id;
            }
            this.set(data);
        },
        search: function () {
            this.get('options.loadRecord')();
        },
        exportData: function () {
            this.get('options.exportData')();
        }
    });
});


