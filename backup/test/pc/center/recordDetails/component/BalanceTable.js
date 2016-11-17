/**
 * @file 余额明细表格
 * @author niuxiaojing
 */
define(function (require, exports, module) {

    'use strict';

    return Ractive.extend({
        template: require('tpl!./BalanceTable.html'),
        data: function () {
            return {
                options: {
                    list: []
                }
            };
        }
    });
});


