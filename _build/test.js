/**
 * Created by phpstorm
 * @file test
 * @author lijun
 * @date 16/10/20
 */
var pack = require('./path/pack');

pack(
    {
        filename: '/test/test1',
        pathname: '{{test}}/test2.js?test=2342342',
        content: 'sdfsfdsf'
    }
);
