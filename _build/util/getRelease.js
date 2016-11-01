/**
 * Created by phpstorm
 * @file release path
 * @author lijun
 * @date 16/10/20
 */
var path = require('path');
var config = require('../config');
var getPathMd5 = require('../tree/lib/getPathMd5');

var projectRoot = config.projectRoot;

var projectOutput = path.join(projectRoot, config.output);
var outputSrc = path.join(projectOutput, config.outputSrc);
var outputLib = path.join(projectOutput, config.outputLib);
/**
 * 发布模板路径
 *
 * @params output {string}
 */
module.exports = function (output, md5) {
    var sep = path.sep;
    var release = '';
    if (output.indexOf(outputSrc) > -1) {
        release = output.replace(outputSrc, config.outputSrc);
    }
    else if (output.indexOf(outputLib) > -1) {
        release = output.replace(outputLib, config.outputLib);
    }
    else {
        console.log('release format error');
    }

    if (md5) {
        release = getPathMd5(release, md5);
    }

    return sep + release;
};