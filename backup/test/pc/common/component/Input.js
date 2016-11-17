/**
 * @file 文本输入框
 * @author zhujialu
 */
define(function (require, exports, module) {

    'use strict';

    var FormText = require('../custom/form/Text');
    var keyboard = require('cc/util/keyboard');

    return Ractive.extend({
        template: require('tpl!./Input.html'),
        data: function () {
            return {
                style: require('text!./Input.styl'),
                options: {
                    name: '',
                    value: '',
                    type: '',
                    placeholder: '',
                    className: '',
                    multiple: false,
                    lazy: false,
                    disabled: false,
                    readonly: false,
                    autofocus: false
                }
            };
        },

        onrender: function () {
            var me = this;
            var mainElement = $(me.getElement());
            var inputElement = mainElement.find(':text,textarea');

            var formText =
            me.formText = new FormText({
                mainElement: mainElement,
                nativeFirst: false,
                watch: {
                    value: function (value) {
                        if (value !== me.get('options.value')) {
                            me.set('options.value', value);
                        }
                    }
                }
            });
            me.observe('options.name', function (name) {
                formText.set('name', name);
            });
            me.observe('options.value', function (value) {
                formText.set('value', value);
            });
            me.observe('options.placeholder', function (placeholder) {
                formText.set('placeholder', placeholder);
            });
            me.observe('options.focus', function (focus) {
                if (focus) {
                    inputElement.focus();
                }
            });
            me.observe('options.blur', function (blur) {
                if (blur) {
                    inputElement.blur();
                }
            });

            me.on('focus', function () {
                me.set({
                    'options.focus': true,
                    'options.blur': false
                });
            });
            me.on('blur', function () {
                me.set({
                    'options.focus': false,
                    'options.blur': true
                });
            });
            me.on('keydown', function (e) {

                var map = { }
                map[ keyboard.enter ] = 'enter';

                var type = map[ e.original.keyCode ];
                if (type) {
                    me.fire(type, e)
                }

            });

        },
        onteardown: function () {
            this.formText.dispose();
        }
    });

});