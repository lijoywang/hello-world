/**
 * Created by bjhl on 16/1/14.
 */
var dependencyMap = require("../tool/feTree").dependencyMap;
var util = require("../tool/util");
var fs = require("fs");
var biz = require("../tool/biz");
var writeTask = require("../tasks/write");

exports.build = function(){
    util.each(dependencyMap,function(dps,pathName){
        if(util.isFont(pathName)) {
            //读取HTML文件，替换内容
            var string = fs.readFileSync(pathName);

            var fileName = biz.getReleaseMd5Name(biz.getReleaseName(pathName),string);

            writeTask.write(fileName,string);
        }
    });
};
