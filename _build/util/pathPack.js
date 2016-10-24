/**
 * Created by phpstorm
 * @file path pack
 * @author lijun
 * @date 16/10/24
 */

var config = require('../config');

/*
* 判断路径是否过滤
* @params pathname
*/
exports.isFilterPath = function (pathname) {
    return /^(http:\/\/|https:\/\/|data:)/ig.test(pathname);
};

exports.pathHandle = function(raw) {
    var result = {
        pathname: '',
        prefix: '',
        params: '',
        extname: '',
        isPlugin: ''
    };
    var pluginReg = /^(text!|tpl!)/;
    var pathReg = /(\.{1,2}|\w+|\d+|\/+)[\w\d\/\.]+$/ig;

    if (pluginReg.test(raw)) {
        Object.assign(
            result,
            {
                isPlugin: true,
                pathname: raw.replace(pluginReg, '')
            }
        );
    }
    else {
        var splits = raw.split('?');
        var pathname = splits[0];
        var params = splits[1] || '';

        if (params) {
            params = '?' + params;
        }

        Object.assign(
            result,
            {
                isPlugin: false,
                prefix: params.replace(pathReg, ''),
                pathname: splits[0].match(pathReg),
                params: params,
                extname: path.extname(pathname)
            }
        );
    }

    return result;
};

exports.pack = function (filename, pathanme) {

};
