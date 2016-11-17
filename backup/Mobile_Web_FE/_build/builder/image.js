/**
 * Created by bjhl on 16/1/14.
 */
var util = require("../tool/util");
var biz = require("../tool/biz");
var writeTask = require("../tasks/write");
var config = require("../config");
var path = require("path");

exports.build = function(){
    if(!util.isLocal()) {
        var iObject = biz.loadImage.getImages();
        //上传图片
        if(iObject && iObject.images.length){
            var imagePath = biz.getReleaseName(config.loadImagePath);

            writeTask.write(imagePath,JSON.stringify(iObject),function(){
                //上传图片
                biz.loadImage.load(path.join(config.public,imagePath));
            });
        }
    }
};
