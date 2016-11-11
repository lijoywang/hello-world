/**
 * Created by bjhl on 16/1/14.
 */
var util = require('../tool/util');
var config = require('../config');
var write = require('write');
var path = require('path');

exports.write =  function (fileName, content, fun) {
    fileName = util.getFilterFileName(fileName);

    var outer = '';
    // 模板文件
    if(util.isHtml(fileName)) {
        outer = path.join(config.view, fileName);
    }
    else {
        // 静态资源文件
        outer = path.join(config.public, fileName);
    }

    write(
        outer,
        content,
        function(error) {
            if (error){
                console.error('writeFile:', {error: error});
            } else {
                fun && fun();
            }
        }
    );
};