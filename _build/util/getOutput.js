/**
 * Created by phpstorm
 * @file output path
 * @author lijun
 * @date 16/10/20
 */
var path = require('path');
var config = require('../config');

var projectRoot = config.projectRoot;

var diskSrc = path.join(projectRoot, config.developSrc);
var diskLib = path.join(projectRoot, config.developLib);

var projectOutput = path.join(projectRoot, config.output);
var outputSrc = path.join(projectOutput, config.outputSrc);
var outputLib = path.join(projectOutput, config.outputLib);
/**
 * 硬盘发布路径
 *
 * @params disk {string}
 * @params md5 {string}
 */
module.exports = function (disk) {
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