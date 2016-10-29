/**
 * Created by phpstorm
 * @file css build
 * @author lijun
 * @date 16/10/20
 */
var stylus = require('stylus');
var epr = require('edp-provider-rider');
var cleanCss = require('clean-css');

var CleanCSS = new cleanCss();
// 默认配置
var stylusPlugin = epr.plugin({
    use: function (style) {
        style.define('url', epr.stylus.resolver());
    }
});

var config = require('../config');

exports.combine = function (filename, content) {
    return new Promise(function (resolve) {
        stylus(content)
        .set('filename', filename)
        .set('paths', [config.developSrc])
        .use(stylusPlugin)
        .render(function (error, content) {
            if (error) {
                console.error(error);
            }
            else {
                resolve(content);
            }
        });
    });
};

exports.build = function () {

};


