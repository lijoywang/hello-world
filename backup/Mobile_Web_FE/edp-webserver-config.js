var path = require("path");

var fs = require("fs");

exports.port = 8081;
exports.directoryIndexes = true;
exports.documentRoot = __dirname;

var epr = require('edp-provider-rider');
exports.stylus = epr.stylus;

// 默认配置
var stylusPlugin = epr.plugin({
    use: function (style) {
        style.define('url', epr.stylus.resolver());
    }
});

exports.getLocations = function () {
    return [
        {
            location: /\/$/,
            handler: home('index.html')
        },
        {
            location: /^\/src\/loader.js/,
            handler: file('./lib/requirejs/require.debug.js')
        },
        {
            location: /^\/static\/report/,
            handler: file('./mock/page.js')
        },
        {
            location: /\.styl($|\?)/,
            handler: [
                file(),
                stylus({
                    stylus: epr.stylus,
                    use: stylusPlugin,
                    paths: [
                        __dirname + '/src/'
                    ]
                })
            ]
        },
        require('./edp-webserver-tpl-mock').init(exports.port),
        require('autoresponse')('edp', { watch: true, logLevel: 'info' }),
        {
            location: function (request) {
                // 修改php匹配策略，不匹配***.html?url=***.php的url--hanzh
                return /\.php($|\?)/.test(request.pathname);
            },
            handler: [
                php('php-cgi')
            ]
        },
        {
            location: /\.html\.js$/,
            handler: html2js()
        },
        {
            location: /^.*$/,
            handler: [
                file(),
                proxyNoneExists()
            ]
        }
    ];
};

exports.injectResource = function (res) {
    for (var key in res) {
        global[key] = res[key];
    }
};
