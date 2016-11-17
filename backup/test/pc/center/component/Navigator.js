/**
 * @file 导航条
 * @author niuxiaojing
 */
define(function (require, exports, module) {

    'use strict';

    return Ractive.extend({
        template: require('tpl!./Navigator.html'),
        data: function () {
            return {
                style: require('text!./Navigator.styl'),
                options: {
                    list: [
                        {
                            label: '',
                            onClick: $.noop
                        }
                    ],
                    selectedIndex: ''
                },

            }
        },
        select: function (index) {
            this.set('options.selectedIndex', index);
            var onClick = this.get('options.list.' + index + '.onClick');
            if ($.isFunction(onClick)) {
                onClick();
            }
        }
    });
});


