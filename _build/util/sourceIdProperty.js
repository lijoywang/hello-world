/**
 * Created by phpstorm
 * @file path handle
 * @author lijun
 * @date 16/10/20
 */
const path = require('path');
/**
 * 资源文件路径过滤
 * @params source {string}
 *
 * @return handle {object}
 * @property pathname {string} 去掉前缀和后缀的路径
 * @property prefix {string} source路径的前缀
 * @property params {string} source路径的后缀
 * @property extname {string} source的扩展名
 * @property isPlugin: false,
 * @property isFilter: false
 *
 */
module.exports = (source, options) => {
    let pathReg = /(\.{1,2}|\w+|\d+|\/+)[\w\d\/\.]+$/ig;
    let filterReg = /^(http:\/\/|https:\/\/|data:)/ig;
    let result = {
        pathname: '',
        isPlugin: false,
        isFilter: false
    };

    let extend = { };

    if (!source || filterReg.test(source)) {
        extend = {
            pathname: source,
            isFilter: true
        };
    }
    else if (source.startsWith('text!')
        && source.startsWith('tpl!')
    ) {
        extend = {
            isPlugin: true,
            pathname: source.replace(pluginReg, '')
        }
    }
    else {
        let splits = source.split('?');
        source = splits[0];

        extend = {
            pathname: source.match(pathReg)[0]
        }
    }


    return Object.assign(
        result,
        extend,
        options || {}
    );
};