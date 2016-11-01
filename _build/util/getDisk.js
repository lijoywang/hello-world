/**
 * Created by phpstorm
 * @file disk path
 * @author lijun
 * @date 16/10/20
 */
var path = require('path');
var config = require('../config');
var amdConfig = config.amdConfig;
var prefixConfig = config.prefixConfig;
/**
 * 硬盘开发路径
 *
 * @params options {object}
 * @property filename {string}
 * @property pathname {string}
 * @property isAmd {boolean}
 */
module.exports = function (options) {
    var filename = options.filename;
    var pathname = options.pathname;

    var diskPath = '';
    // 模块
    if (options.isAmd) {
        var baseUrl = amdConfig.baseUrl;
        var paths = amdConfig.paths;

        var amdPath = paths[pathname];
        if (amdPath) {
            diskPath = path.join(baseUrl, amdPath);
        }
    }
    // template
    else {
        var prefixKey = '';
        for (var key in prefixConfig) {
            // TODO
            if (pathname.indexOf(key) === 0) {
                prefixKey = key;
            }
        }

        if (prefixKey) {
            diskPath = path.join(
                config.projectRoot,
                prefixConfig[key],
                pathname.replace(prefixKey, '')
            );
        }
    }

    if (!diskPath) {
        diskPath = path.join(
            path.dirname(filename),
            pathname
        );
    }
    return diskPath;
};
/**
 * 硬盘发布路径
 *
 * @params disk {string}
 */
exports.getOutput = function (disk) {
    var output = '';

    if (disk.indexOf(diskSrc) > -1) {
        output = disk.replace(diskSrc, outputSrc);
    }
    else if (disk.indexOf(diskLib) > -1) {
        output = disk.replace(diskLib, outputLib);
    }
    else {
        console.log('diskPath format error');
    }

    return output;
};