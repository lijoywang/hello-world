/**
 * Created by bjhl on 15/12/5.
 */

var fs = require("fs");
var esprima = require("esprima");
var walk = require("esprima-walk");
var escodegen = require("escodegen");

var config = require("../config");
var util = require("../tool/util");
//获取所有的AMD配置文件
exports.getManifest = (function(){
    var _mainfest = "";

    return function(){
        if(!_mainfest){
            var content = fs.readFileSync(config.manifest, "utf-8");

            if(content) {
                var ast = esprima.parse(content);

                walk(ast,function(block){

                    if(block.type == "CallExpression") {
                        var arguments = block.arguments;

                        if(arguments && arguments.length) {

                            var callee = block.callee || {};

                            var property = callee.property || {};
                            //替换图片
                            if(property.name === "config") {

                                _mainfest = escodegen.generate(arguments[0]) || [];

                                return false;
                            }

                        }
                    }
                });
            }

            var json = eval('(' + _mainfest + ')');

            json["baseUrl"] = util.getFilterFileName(json.baseUrl);

            _mainfest = json;
        }

        return _mainfest;
    }
})();
