/**
 * Created by bjhl on 15/11/27.
 */
var walk = require("esprima-walk"); //递归
var biz = require("../tool/biz");
//避免二次AMD
var config = {}
//require replace name
exports.amd = function(amd,rootPath){

    var path = amd.path;
    var ast = amd.ast;

    if(!config[amd.path] && ast) {
        walk(amd.ast,function(json){
            var json = json || {};
            if(json.type == "CallExpression") {
                var callee = json.callee || {},
                    dfArray = json.arguments||[];
                //dfine
                if(callee.name === "define"){
                    dfArray.unshift({
                        "type": "Literal",
                        "value": biz.getReleaseName(path)
                    });
                }
            }
        });

        config[amd.path] = true;
    }
};
