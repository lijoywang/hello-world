/**
 * Created by bjhl on 16/1/14.
 */
var config = require("../config");
var fs = require("fs");
var path = require("path");
var util = require("../tool/util");
//获取所有入口文件
module.exports = (function(){
    //build入口文件
    var _allFills = [],
        _allWhiteList = {},
        _removal = {},//去重
        _addImageWhiteList = function(pageName,images){

            if("string" == typeof images) {
                images = [images];
            }

            util.each(images,function(fileName){
                var fixPath = util.fixPath(fileName,pageName);

                if(!_allWhiteList[fixPath]) {

                    //var content = fs.readFileSync(fixPath);
                    //
                    //var md5 = util.md5(content);

                    _allWhiteList[fixPath] = true;

                    //_allWhiteList[fixPath] = md5;
                }
            });

        },
        _addExportsFile = function(pathName,fileName){

            var fixPath = util.fixPath(fileName,pathName);

            if(!_removal[fixPath]) {
                _allFills.push(fixPath);

                _removal[fixPath] = true;
            }
        },
        _setFiles = function(pathName,data){
            if(data && !data.length) {
                data = [data];
            }

            data.forEach(function(json){

                json.tpl && _addExportsFile(pathName,json.tpl);

                json.image_white_list && _addImageWhiteList(pathName,json.image_white_list)

            });
        },
        _get = function(root,fileName){
            var root = root || config.developSrc,
                fileName = fileName || "page.json"

            var files = fs.readdirSync(root);

            if(files){
                files.forEach(function(name){
                    var pn = path.join(root,name);
                    if(name == fileName){
                        var data = fs.readFileSync(pn,"utf-8");

                        if(data) {
                            data = JSON.parse(data);

                            _setFiles(pn,data);
                        }
                    } else {
                        if(fs.existsSync(pn) && fs.statSync(pn).isDirectory()) {
                            _get(pn);
                        }
                    }
                });
            }
        },
        _load = false;

    return (function(){

        var loadPageJson = function(root,fileName){
            if(!_load) {
                _get(root,fileName);

                _load = true;
            }
        };

        return {
            getExportsFile: function(root,fileName){
                loadPageJson(root,fileName);

                return _allFills;
            },
            getImagesWhiteList: function(root,fileName){
                loadPageJson(root,fileName);

                return _allWhiteList;
            }
        }
    })();
})();