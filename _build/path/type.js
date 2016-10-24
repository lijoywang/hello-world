/**
 * Created by phpstorm
 * @file file type
 * @author lijun
 * @date 16/10/20
 */
var handle = require('./handle');

function is(pattern, pathname) {
    var extname = handle(pathname).extname;

    return pattern.indexOf(extname) > -1;
}

exports.isHtml = function (pathname) {
    return is(
        [
            '.html',
            '.tpl'
        ],
        pathname
    );
};

exports.isCss = function (pathname) {
    return is(
        [
            '.styl',
            '.css',
            'less'
        ],
        pathname
    );
};

exports.isJs = function (pathname) {
    return is(
        [
            '.js'
        ],
        pathname
    );
};

exports.isImage = function (pathname) {
    return is(
        [
            '.png',
            '.jpeg'
        ],
        pathname
    );
};

exports.isFont = function (pathname) {
    return is(
        [
            '.font'
        ],
        pathname
    );
}

exports.isOther = function (pathname) {
    return !exports.isHtml(pathname)
        && !exports.isCss(pathname)
        && !exports.isImage(pathname)
        && !exports.isJs(pathname)
        && !exports.isFont(pathname);
};