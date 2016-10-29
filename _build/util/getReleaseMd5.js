/**
 * Created by phpstorm
 * @file get release md5 path
 * @author lijun
 * @date 16/10/20
 */
var path = require('path');

/**
 * 发布模板路径md5
 *
 * @params release {string}
 */
module.exports = function (release, md5, sourceProperty) {
    return path.join(
        sourceProperty.prefix,
        release
            + '_'
            + md5
            + sourceProperty.params
    );
};