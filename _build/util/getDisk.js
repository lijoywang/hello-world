/**
 * Created by phpstorm
 * @file disk path
 * @author lijun
 * @date 16/10/20
 */
const path = require('path');
const config = require('../config');
const amdConfig = config.amdConfig;
const prefixConfig = config.prefixConfig;
/**
 * 硬盘开发路径
 *
 * @params options {object}
 * @property filename {string}
 * @property pathname {string}
 * @property isAmd {boolean}
 */
module.exports = (options) => {
    let filename = options.filename;
    let pathname = options.pathname;

    let diskPath = '';
    // 模块
    if (options.isAmd) {
        let baseUrl = amdConfig.baseUrl;
        let paths = amdConfig.paths;

        let amdPath = paths[pathname];
        if (amdPath) {
            diskPath = path.join(baseUrl, amdPath);
        }
    }
    // template
    else {
        let prefixKey = '';
        for (let key in prefixConfig) {
            if (pathname.startsWith(key)) {
                prefixKey = key;
                return false;
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
