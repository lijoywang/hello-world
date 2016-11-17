/**
 * @file 交易明细表格
 * @author niuxiaojing
 */
define(function (require, exports, module) {

    'use strict';

    return Ractive.extend({
        template: require('tpl!./TradeTable.html'),
        data: function () {
            return {
                options: {
                    list: []
                }
            };
        }
    });
});


