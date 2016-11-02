/**
 * Created by phpstorm
 * @file builder
 * @author lijun
 * @date 16/10/20
 */
const path = require('path');
const config = require('./config');

const {parse, buildTree, write} = require('./tree/index');
const fileType = require('./tree/lib/fileType');
const sourceIdProperty = require('./util/sourceIdProperty');
const getDisk = require('./util/getDisk');
const getOutput = require('./util/getOutput');
const plugin = require('./util/plugin');
const getPathMd5 = require('./util/getPathMd5');

exports.builder = {
    'js': require('./task/js'),
    'css': require('./task/css'),
    'html': require('./task/html'),
    'image': require('./task/image'),
    'other': require('./task/other')
};

exports.build = () => {
    parse(
        {
            files: config.files,
            rules: config.rules,
            filter: (options) => {
                let {filename, sourceId} = options;
                if (!sourceId) {
                    return {
                        filename,
                        output: getOutput(filename)
                    }
                }
                else {
                    var property = sourceIdProperty(sourceId);

                    filename = getDisk(
                        {
                            filename,
                            pathname: property.pathname,
                            isAmd: options.isAmd
                        }
                    );

                    let output = getOutput(filename);
                    if (property.isPlugin) {
                        output = plugin.getPath(output);
                    }

                    // 完善node节点，为打包做准备
                    return Object.assign(
                        property,
                        {
                            filename,
                            output,
                            pattern: options.pattern
                        }
                    );
                }
            }
        }
    )
    .then((treeNode) => {
        buildTree(
            {
                tree: treeNode,
                builder: (node) => {
                    var builder = exports.builder[fileType.type(node.filename)];

                    if (builder) {
                        var promise =
                            builder.build(node)
                            .then((builed) => {
                                if (builed) {
                                    // 输出文件
                                    write(getPathMd5(node.output, node.amd5), node.content);
                                }
                            })
                            .catch((error) => {
                                console.log(error)
                            });
                        return promise;
                    }
                    else {
                        console.log('error:' + node);
                    }
                },
                // 增量md5 list
                md5path: path.join(config.projectRoot, config.developSrc, 'md5Cache.json'),
                complete: function () {
                    // TODO
                }
            }
        );
    })
    .catch((error) => {
        console.log(error);
    });
};
