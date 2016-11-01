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

var fileType = require('../tree/lib/fileType');
var config = require('../config');
var getOutput = require('../util/getOutput');
var plugin = require('../util/plugin');

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
/**
 * 父节点中如果有html入口文件，则为入口文件
 */
exports.isEntry = function (node) {
    var boolean = false;
    var parentMap = node.parentMap;

    if (parentMap.size) {
        parentMap.forEach(function (parentNode) {
            if (fileType.isHtml(parentNode.filename)) {
                boolean = true;
                return false;
            }
        });
    }
    else {
        boolean = true;
    }

    return boolean;
};
/**
 * css打包
 *
 * @params node {object} node节点
 *
 * @return
 * 添加节点output与content属性
 */
exports.build = function (node) {
    return new Promise(function (resolve) {
        var filename = node.filename;
        var content = node.content;

        var output = getOutput(filename);

        if (node.isPlugin || exports.isEntry(node)) {
            exports.combine(filename, content)
            .then(function (content) {
                if (node.isPlugin) {
                    content = plugin.getContent(content);
                    output = plugin.getPath(output);
                }

                node.content = content;
                node.output = output;

                resolve();
            });
        }
        else {
            resolve();
        }
    });
};


