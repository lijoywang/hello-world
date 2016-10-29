/**
 * Created by phpstorm
 * @file file type
 * @author lijun
 * @date 16/10/29
 */
var path = require('path');


module.exports = function (filename) {

    var extname = path.extname(filename);
    var result = { };

    var types = [
        {
            type: 'isJs',
            rule: [
                '.js'
            ]
        },
        {
            type: 'isCss',
            rule: [
                '.css',
                '.styl',
                '.scss'
            ]
        },
        {
            type: 'isHtml',
            rule: [
                '.tpl',
                '.html'
            ]
        }
    ];

    types.forEach(function (typeItem) {
        if (typeItem.rule.indexOf(extname) > -1) {
            result[typeItem.type] = true;
            return false;
        }
    });

    return result;
};