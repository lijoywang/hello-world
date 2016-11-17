/**
 * @file 验证表单常用的正则
 * @author zhujialu
 */
define(function (require, exports, module) {

    'use strict';

    var validator = require('cc/util/validator');
    var isMoney = require('./validator/isMoney');
    var isPositiveNumber = require('./validator/isPositiveNumber');

    exports.init = function () {

        validator.buildInPatterns = {
            char: /^[\w\u2E80-\u9FFF]+$/,
            positive: /^[\d.]*$/,
            positiveInt: /^\d*$/,

            id: /^\d{14}(\d{3}){0,1}[\d,A-Z,a-z]$/,
            mobile: /^1\d{10}$/,
            money: function (data) {
                return isMoney(data.value);
            },
            positiveNumber: function (data) {
                return isPositiveNumber(data.value);
            },
        };

    };

});