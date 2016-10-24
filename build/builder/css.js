/**
 * Created by bjhl on 16/1/14.
 */
var util = require('../tool/util');
var cssTask = require('../tasks/cssResolve');
var reverseDependencyMap = require('../tool/feTree').reverseDependencyMap;

exports.build = function () {
    return new Promise(function (resolve, reject) {
        util.each(reverseDependencyMap, function (deps, rootPath) {
            if (util.isCss(rootPath)) {
                cssTask.cssResolve(deps, rootPath)
                .all(function () {
                    resolve();
                });
            }
        });
    });
};