/**
 * Created by phpstorm
 * @file css build
 * @author lijun
 * @date 16/10/20
 */
const stylus = require('stylus');
const epr = require('edp-provider-rider');
const cleanCss = require('clean-css');

const CleanCSS = new cleanCss();
// 默认配置
const stylusPlugin = epr.plugin({
    use: function (style) {
        style.define('url', epr.stylus.resolver());
    }
});

const fileType = require('../tree/lib/fileType');
const config = require('../config');
const getOutput = require('../util/getOutput');
const plugin = require('../util/plugin');

exports.combine = (filename, content) => {
    return new Promise(resolve => {
        stylus(content)
        .set('filename', filename)
        .set('paths', [config.developSrc])
        .use(stylusPlugin)
        .render((error, content) => {
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
exports.isEntry = (node) => {
    let boolean = false;
    let parentMap = node.parentMap;

    if (parentMap.size) {
        parentMap.forEach(parentNode => {
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
exports.build = (node) => {
    return new Promise((resolve, reject) => {
        let filename = node.filename;
        let content = node.content;

        if (node.isPlugin || exports.isEntry(node)) {
            exports.combine(node.filename, content)
            .then(content => {
                if (node.isPlugin) {
                    content = plugin.getContent(content);
                }

                node.content = content;
                resolve(true);
            });
        }
        else {
            resolve(false);
        }
    });
};


