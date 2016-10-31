/**
 * Created by phpstorm
 * @file tree
 * @author lijun
 * @date 16/10/24
 */

/**
 * 同步遍历树
 *
 * @params {object}
 * @property files {array} 入口文件
 * @property files {string} 当前文件名称
 * @property rules {object} 内容正则
 * @property filter {fun} 根据rules返回sourceId
 */
exports.parse = require('./lib/parse');

/**
 * 从叶子结点开始构建，当前结点构建完成，通知上级结点，
 * 上级节点等待所有子节点完成之后再构建自身，直到构建完成
 *
 * @params {object}
 * @property tree {object}
 * @property builder {fun}
 * @property md5list {object} 发布之前的md5列表， 根据此列表判断是否增量发布
 */
exports.build = require('./lib/build');