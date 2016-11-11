/**
 * @file 下拉框
 * @author zhujialu
 */
define(function (require, exports, module) {

    'use strict';

    var Select = require('../custom/form/Select');

    return Ractive.extend({
        template: require('tpl!./Select.html'),
        data: function () {
            return {
                options: {
                    name: '',
                    className: '',
                    defaultText: '请选择',
                    data: null,
                    value: '',
                    disabled: false,
                    hidden: false,
                    onselect: $.noop
                }
            };
        },
        onrender: function () {
            var me = this;
            var select =
            me.select = new Select({
                mainElement: $(me.getElement()),
                data: me.get('options.data'),
                value: me.get('options.value'),
                defaultText: me.get('options.defaultText'),
                onselect: me.get('options.onselect'),
                watch: {
                    value: function (value) {
                        if (value == me.get('options.value')) {
                            return;
                        }
                        me.set('options.value', value);
                    }
                }
            });
            me.observe('options.value', function (value) {
                select.set('value', value);
            });
            me.observe('options.data', function (data) {
                select.set('data', data);
            });
        },
        onteardown: function () {
            this.select.dispose();
        }
    });

});