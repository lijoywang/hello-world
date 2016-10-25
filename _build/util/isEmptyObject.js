/**
 * Created by phpstorm
 * @file empty object
 * @author lijun
 * @date 16/10/25
 */

module.exports = function (data) {
    data = data || {};

    for (var key in data || {}) {
        return false;
    }
    return true;
};