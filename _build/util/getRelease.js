/**
 * Created by phpstorm
 * @file release path
 * @author lijun
 * @date 16/10/20
 */
const path = require('path');
const config = require('../config');
const getPathMd5 = require('./getPathMd5');

const projectRoot = config.projectRoot;

const projectOutput = path.join(projectRoot, config.output);
const outputSrc = path.join(projectOutput, config.outputSrc);
const outputLib = path.join(projectOutput, config.outputLib);
/**
 * 发布模板路径
 *
 * @params output {string}
 */
module.exports = (output, md5) => {
    let sep = path.sep;
    let release = '';
    if (output.startsWith(outputSrc) > -1) {
        release = output.replace(outputSrc, config.outputSrc);
    }
    else if (output.startsWith(outputLib) > -1) {
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