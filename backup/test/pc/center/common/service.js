/**
 * @file 接口
 * @author zhujialu
 */
define(function (require, exports, module) {

    'use strict';

    var service = require('common/service');

    service.getUserInfo = function () {
        return service.post(
            '/wallet/userInfo'
        );
    };

    service.quit = function () {
        return service.post(
            '/wallet/quit'
        );
    };

    return service;

});