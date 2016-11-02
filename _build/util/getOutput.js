/**
 * Created by phpstorm
 * @file output path
 * @author lijun
 * @date 16/10/20
 */
let path = require('path');
let config = require('../config');

let projectRoot = config.projectRoot;

let diskSrc = path.join(projectRoot, config.developSrc);
let diskLib = path.join(projectRoot, config.developLib);

let projectOutput = path.join(projectRoot, config.output);
let outputSrc = path.join(projectOutput, config.outputSrc);
let outputLib = path.join(projectOutput, config.outputLib);
/**
 * 硬盘发布路径
 *
 * @params disk {string}
 * @params md5 {string}
 */
module.exports = (disk) => {
    let output = '';

    if (disk.startsWith(diskSrc)) {
        output = disk.replace(diskSrc, outputSrc);
    }
    else if (disk.startsWith(diskLib)) {
        output = disk.replace(diskLib, outputLib);
    }
    else {
        console.log('diskPath format error');
    }

    return output;
};