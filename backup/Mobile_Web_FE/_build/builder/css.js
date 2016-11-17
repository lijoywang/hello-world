/**
 * Created by bjhl on 16/1/14.
 */
var util = require("../tool/util");
var cssTask = require("../tasks/cssResolve");

var reverseDependencyMap = require("../tool/feTree").reverseDependencyMap;

exports.build = function(callbackFunction){
    var source = 0;

    util.each(reverseDependencyMap,function(deps,rootPath){
        if(util.isCss(rootPath)){
            source++;
            cssTask.cssResolve(deps,rootPath,callbackFunction);
        }
    });
    if(!source) {
        callbackFunction && callbackFunction();
    }
}