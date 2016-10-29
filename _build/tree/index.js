/**
 * Created by phpstorm
 * @file tree
 * @author lijun
 * @date 16/10/24
 */

/**
 * 遍历树
 *
 * @params {object}
 * @property files {array} 入口文件
 * @
 */
exports.parse = require('./lib/parse');


/**
 * 叶子结点开始构建
 *
 * @params {object}
 * @property tree {object}
 * @property builder {fun}
 * @property md5List {object} 发布之前的md5列表， 根据此列表判断是否增量发布
 */
exports.build = require('./lib/build');