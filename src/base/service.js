/**
 * @file 接口层
 * @author zhujialu
 */
define(function (require, exports, module) {

    'use strict';

    var toNumber = require('cc/function/toNumber');
    var toString = require('cc/function/toString');

    /**
     * 发送 post 请求
     *
     * @param {string} url
     * @param {Object} data
     * @return {Promise}
     */
    function post(url, data, options) {

        data = data || { };

        var deferred = $.Deferred();

        options = options || { };

        $.ajax({
            url: url,
            data: options.stringify ? JSON.stringify(data) : data,
            method: 'post',
            dataType: 'json',
            async: options.sync ? false : true
        })
        .then(function (response) {

            var code = response.code;
            var successCode = 0;

            if (code == null) {
                code = response.status;
                successCode = 200;
            }

            if (code === successCode) {
                deferred.resolve(response);
            }
            else {

                var msg = response.msg;
                if (!options.preventError && msg) {
                    alert({
                        title: '提示',
                        content: msg
                    });
                }

                deferred.reject(response);

            }
        })
        .fail(function (response) {
            deferred.reject(response);
        });

        return deferred;

    }

    /**
     * 发送跨域的 jsonp请求
     *
     * @param {string} url
     * @param {Object} data
     * @return {Promise}
     */
    function getJsonp(url, data) {
        return $.ajax({
            url: url,
            data: data,
            dataType: 'jsonp'
        });
    }

    exports.post = post;

    exports.jsonp = getJsonp;

    /**
     * 格式化成数字
     *
     * @param {*} value
     * @return {string?}
     */
    exports.toNumber = function (value) {
        return toNumber(value, null);
    };

    /**
     * 格式化成字符串
     *
     * @param {*} value
     * @return {string?}
     */
    exports.toString = function (value) {
        value = toString(value, null);
        return value === '' ? null : value;
    };

    /**
     * 格式化成时间戳
     *
     * @param {string} value
     * @return {number?}
     */
    exports.toTimestamp = function (value) {
        value = value.replace(/[-.]/g, '/');
        return value ? (+new Date(value)) : null;
    };

    /**
     * 确保表格数据的完整性
     *
     * @param {Object} response
     * @return {Object}
     */
    exports.ensureGridData = function (response) {

        var data = response.data;

        data.list = data.list || [ ];
        data.pager = data.pager || { };

        return response;

    };

    /**
     * 获取地区列表
     *
     * @param {Object} data
     * @property {string} data.id 地区 ID
     * @return {Promise}
     */
    exports.getRegionList = function (data) {
        return exports.post(
            '/area/list',
            {
                area_id: data.id
            }
        );
    };

});