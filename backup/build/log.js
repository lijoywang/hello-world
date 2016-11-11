/**
 * Created by bjhl on 15/12/17.
 */
var path = require('path');
var log4js = require('log4js');

log4js.configure({
    appenders: [
        { type: 'console' },
        {
            type: 'file',
            filename: 'logs/access.log',
            maxLogSize: 1024,
            backups: 4,
            category: 'error'
        }
    ],
    replaceConsole: true
});