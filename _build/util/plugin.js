/**
 * Created by phpstorm
 * @file get plugin name
 * @author lijun
 * @date 16/10/20
 */
exports.getPath = (path) => {
    return path.join(path.dirname(path), 'plugin', path.basename(path));
};

exports.getContent = (pluginPath, content) => {
    return "define("
        + JSON.stringify(pluginPath)
        + ",function(require){return "
        +JSON.stringify(content)
        + "})";
};