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
                // node节点添加属性
                return Object.assign(
                    property,
                    {
                        filename: disk
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
                    var extname = fileType.extname(node.filename);
                    // TODO
                    var builder = exports.builder[extname];

                    if (builder) {
                        return builder(node);
                    }
                    else {
                        console.log('error:' + node);
                    }
                }
            }
        );
    });
};
