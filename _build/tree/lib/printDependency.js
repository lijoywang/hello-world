/**
 * Created by phpstorm
 * @file print dependency
 * @author lijun
 * @date 16/10/29
 */
const noop = require('./noop');
/**
 * 输出依赖关系
 *
 * @params tree {object}
 * @params format {fun} 格式化路径
 *
 * @return
 * {
 *  md5:{},
 *  dependency:{}
 * }
 */
module.exports = (tree, format = noop) => {
    let dependencyMap = {
        md5list: { },
        dependency: { }
    };

    tree.forEach(node => {
        let filename = format(node.filename);
        let md5list = dependencyMap.md5list;
        let dependency = dependencyMap.dependency;
        let childMap = node.childMap;
        
        let rootDependency = dependency[filename] = [];
        if (childMap.size) {
            childMap.forEach(childNode => {
                rootDependency.push(childNode.filename);
            });
        }

        md5list[filename] = node.md5;
    });
};