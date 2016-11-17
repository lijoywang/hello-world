/**
 * Created by bjhl on 16/1/14.
 */
var feTree = require("../tool/feTree");
var util = require("../tool/util");
var fs = require("fs");
var biz = require("../tool/biz");
var writeTask = require("../tasks/write");
var htmlRenameTask = require("../tasks/htmlRename");

var dependencyMap = feTree.dependencyMap;
var reverseDependencyMap = feTree.reverseDependencyMap;

var isExports = function(pathName){
    var rdeps = reverseDependencyMap[pathName] && reverseDependencyMap[pathName].join();

    if(!rdeps || rdeps.indexOf(".html") > -1 || rdeps.indexOf(".tpl") > -1) {
        return true;
    }
    return false;
}

exports.build = function(){
    util.each(dependencyMap,function(deps,pathName){
        if(util.isHtml(pathName) && isExports(pathName)) {
            //读取HTML文件，替换内容
            var string = biz.readFileSync(pathName);
            var html = htmlRenameTask.htmlRename(pathName,string);
            writeTask.write(biz.getReleaseName(pathName),html);
        }
    });
};
