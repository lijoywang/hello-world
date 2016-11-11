/**
 * @file 身份证验证
 * @author lijun
 */
define(function (require, exports, module) {

    'use strict';

    return function (value) {
        return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value);
    };

});