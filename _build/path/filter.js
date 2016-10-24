/**
 * Created by phpstorm
 * @file filter
 * @author lijun
 * @date 16/10/20
 */
var config = require('../config');

exports.isFilterPath = function (pathname) {
    return /^(http:\/\/|https:\/\/|data:)/ig.test(pathname);
};

exports.isPlugin = function (pathname) {

};