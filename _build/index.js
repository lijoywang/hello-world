/**
 * Created by phpstorm
 * @file builder
 * @author lijun
 * @date 16/10/20
 */
var config = require('./config');

var tree = require('./tree/index');
var sourceIdProperty = require('./util/sourceIdProperty');
var getDisk = require('./util/getDisk');

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

                return Object.assign(
                    property,
                    {
                        filename: disk
                    }
                );
            }
        }
    )
    //.then(function (treeNode) {
    //    tree.build(
    //        {
    //            tree: treeNode,
    //            builder: function (node) {
    //                return new Promise(function (resolve) {
    //                   resolve();
    //                });
    //            }
    //        }
    //    );
    //});
};
