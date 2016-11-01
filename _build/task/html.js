/**
 * Created by phpstorm
 * @file html build
 * @author lijun
 * @date 16/10/20
 */
var getOutput = require('../util/getOutput');
var getRelease = require('../util/getRelease');
var plugin = require('../util/plugin');

exports.getContent = function (node) {
    var content = node.content;
    var childMap = node.childMap;
    if (childMap.size) {
        childMap.forEach(function (childNode) {
            content = content.replace(
                childNode.pattern,
                function (value) {
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

exports.build = function (node) {
    return new Promise(function (resolve) {
        var filename = node.filename;
        var content = exports.getContent(node);

        var output = getOutput(filename);

        if (node.isPlugin) {
            content = plugin.getContent(getRelease(output), content);
            output = plugin.getPath(output);
        }

        node.content = content;
        node.output = output;

        resolve();
    });
};