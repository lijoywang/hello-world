/**
 * Created by phpstorm
 * @file file type
 * @author lijun
 * @date 16/10/29
 */
const path = require('path');

exports.isHtml = (filename) => {
    return [
        '.html',
        '.tpl'
    ]
    .indexOf(path.extname(filename)) > -1;
};

exports.isCss = (filename) => {
    return [
        '.styl',
        '.css',
        '.scss'
    ]
    .indexOf(path.extname(filename)) > -1;
};

exports.isJs = (filename) => {
    return [
        '.js'
    ]
    .indexOf(path.extname(filename) || '.js') > -1;
};

exports.isImage = (filename) => {
    return [
        '.png',
        '.jpeg'
    ]
    .indexOf(path.extname(filename)) > -1;
};

exports.isOther = (filename) => {
    return !exports.isJs(filename)
        && !exports.isCss(filename)
        && !exports.isHtml(filename)
        && !exports.isImage(filename);
};

exports.type = (filename) => {
    let extname = '';
    if (exports.isJs(filename)) {
        extname = 'js';
    }
    else if (exports.isHtml(filename)) {
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