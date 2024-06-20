const setting={
    "debugLogFilePath": "/log/debug.log",
    "traceLogFilePath": "/log/trace.log",
    "errorLogFilePath": "/log/error.log",
    "cpuNum":1,
    "debug":true,
    "zookeeper":"",
    "context":"/public"
}
const log4js = require('log4js');
log4js.configure({
    appenders: {
        out : {type: 'console'},
        out : {type: 'dateFile', filename: setting.debugLogFilePath, 'pattern': '-yyyy-MM', category: 'debug'},
        out : {type: 'dateFile', filename: setting.traceLogFilePath, 'pattern': '-yyyy-MM-dd', category: 'trace'},
        app: {type: 'file', filename: setting.errorLogFilePath, maxLogSize: 1024000, backups: 10, category: 'error'}
    },
    categories: {
        default: { appenders: [ 'out', 'app' ], level: 'debug' }
    },
    replaceConsole: true
});
exports.debugLogger = log4js.getLogger('debug');
exports.traceLogger = log4js.getLogger('trace');
exports.errorLogger = log4js.getLogger('error');
exports.setting = setting;