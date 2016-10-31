/**
 * Created by phpstorm
 * @file file type
 * @author lijun
 * @date 16/10/29
 */
var path = require('path');

exports.isHtml = function (filename) {
    return [
        '.html',
        '.tpl'
    ]
    .indexOf(path.extname(filename)) > -1;
};

exports.isCss = function (filename) {
    return [
        '.styl',
        '.css',
        '.scss'
    ]
    .indexOf(path.extname(filename)) > -1;
};

exports.isJs = function (filename) {
    return [
        '.js'
    ]
    .indexOf(path.extname(filename) || '.js') > -1;
};

exports.isImage = function (filename) {
    return [
        '.png',
        '.jpeg'
    ]
    .indexOf(path.extname(filename)) > -1;
};

exports.isOther = function (filename) {
    return !exports.isJs(filename)
        && !exports.isCss(filename)
        && !exports.isHtml(filename)
        && !exports.isImage(filename);
};

exports.type = function (filename) {
    var extname = '';
    if (exports.isJs(filename)) {
        extname = 'js';
    }
    else if (exports.isHtml) {
        extname = 'html'
    }
    else if (exports.isCss(filename)) {
        extname = 'css';
    }
    else if (exports.isImage(filename)) {
        extname = 'image';
    }
    else {
        extname = 'other';
    }
    return extname;
};