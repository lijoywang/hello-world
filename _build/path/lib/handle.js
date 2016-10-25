/**
 * Created by phpstorm
 * @file path handle
 * @author lijun
 * @date 16/10/20
 */
var path = require('path');

module.exports = function (resource) {
    var model = {
        pathname: '',
        prefix: '',
        params: '',
        extname: '',
        isPlugin: false,
        isFilter: false,
        isAmd: false
    };

    var pluginReg = /^(text\!|tpl\!)/;
    var pathReg = /(\.{1,2}|\w+|\d+|\/+)[\w\d\/\.]+$/ig;
    var filterReg = /^(http:\/\/|https:\/\/|data:)/ig;

    var extend = { };

    if (!resource || filterReg.test(resource)) {
        Object.assign(
            model,
            {
                isFilter: true
            }
        );
    }
    else if (pluginReg.test(resource)) {
        Object.assign(
            model,
            {
                isPlugin: true,
                pathname: resource.replace(pluginReg, '')
            }
        );
    }
    else {
        var splits = resource.split('?');
        var resource = splits[0];
        var params = splits[1] || '';

        if (params) {
            params = '?' + params;
        }

        Object.assign(
            model,
            {
                prefix: resource.replace(pathReg, ''),
                pathname: resource.match(pathReg)[0],
                params: params,
                extname: path.extname(resource)
            }
        );
    }

    if (model.extname === ''
        || model.extname === '.js'
    ) {
        model.isAmd = true;
    }

    return model;
};