/**
 * Created by phpstorm
 * @file builder
 * @author lijun
 * @date 16/10/20
 */
var config = require('./config');

var tree = require('./tree/index');
var fileType = require('./tree/lib/fileType');
var sourceIdProperty = require('./util/sourceIdProperty');
var getDisk = require('./util/getDisk');

exports.builder = {
    'js': require('./task/js'),
    'css': require('./task/css'),
    'html': require('./task/html'),
    'image': require('./task/image'),
    'other': require('./task/other')
};

exports.build = function () {
    tree.parse(
        {
            files: config.files,
            rules: config.rules,
            filter: function (options) {
                var sourceId = options.sourceId;
                var property = sourceIdProperty(sourceId);

                var disk = getDisk(
                    {
                        filename: options.filename,
                        pathname: property.pathname,
                        isAmd: options.isAmd
                    }
                );

                // 完善node节点，为打包做准备
                return Object.assign(
                    property,
                    {
                        filename: disk,
                        pattern: options.pattern
                    }
                );
            }
        }
    )
    .then(function (treeNode) {
        tree.build(
            {
                tree: treeNode,
                builder: function (node) {
                    var builder = exports.builder[fileType.type(node.filename)];

                    if (builder) {
                        var promise =
                            builder.build(node)
                            .catch(function (error) {
                                console.log(Promise.reject(error))
                            });
                        return promise;
                    }
                    else {
                        console.log('error:' + node);
                    }
                }
            }
        );
    })
    .catch( function (error) {
        console.log(Promise.reject(error));
    });
};
