/**
 * @file 处理浏览器支持情况
 * @author zhujialu
 */
define(function (require, exports, module) {

    'use strict';

    var support = require('cc/util/support');
    var html = require('cc/util/instance').html;

    exports.init = function () {

        var classList = [ ];

        if (support.animation()) {
            exports.animation = true;
            classList.push('animation');
        }
        else {
            classList.push('no-animation');
        }

        if (support.boxShadow()) {
            exports.boxShadow = true;
            classList.push('box-shadow');
        }
        else {
            classList.push('no-box-shadow');
        }

        if (support.flash()) {
            exports.flash = true;
        }

        if (support.localStorage()) {
            exports.localStorage = true;
        }

        html.addClass(
            classList.join(' ')
        );

    };

});