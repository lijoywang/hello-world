/**
 * Created by phpstorm
 * @file path handle
 * @author lijun
 * @date 16/10/20
 */
var handle = require('./lib/handle');
var paths = require('./lib/paths');

/**
 * @params options
 * @property filename {string} 硬盘路径
 * @property resource {string} 路径
 * @property isAmd {boolean}
 */
module.exports = function (options) {

    var property = { };

    Object.assign(property, handle(options.resource));

    Object.assign(property, paths(options));

    return property;
};