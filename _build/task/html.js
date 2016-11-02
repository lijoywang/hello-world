/**
 * Created by phpstorm
 * @file html build
 * @author lijun
 * @date 16/10/20
 */
const getOutput = require('../util/getOutput');
const getRelease = require('../util/getRelease');
const plugin = require('../util/plugin');

exports.getContent = node => {
    var content = node.content;
    var childMap = node.childMap;
    if (childMap.size) {
        childMap.forEach(childNode => {
            content = content.replace(
                childNode.pattern,
                value => {
                    // absolute 绝对路径优先替换
                    var patternString =
                    value.replace(
                        childNode.pathname,
                        childNode.absolutePath || getRelease(childNode.output, childNode.amd5)
                    );
                    return patternString;
                }
            );
        });
    }

    return content;
};

exports.build = node => {
    return new Promise((resolve, reject) => {
        let filename = node.filename;
        let content = exports.getContent(node);

        if (node.isPlugin) {
            content = plugin.getContent(getRelease(node.output), content);
        }
        node.content = content;

        resolve(true);
    });
};