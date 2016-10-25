/**
 * Created by phpstorm
 * @file builder
 * @author lijun
 * @date 16/10/20
 */
var config = require('./config');

var tree = require('./util/tree');

exports.build = function () {
    tree.parse(
        {
            files: config.files,
            amdConfig: config.amdConfig,
            rules: config.rules,
            filter: function (pathname) {

            }
        }
    )
    //.then(function (des, redes) {
    //
    //});
};