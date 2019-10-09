const urllib = require('urllib');
const Transport = require('egg-logger').Transport;
const util = require('util');

class UrllibTransport extends Transport {

    log(level, args, meta) {
        let log, result = {};
        const ctx = args[1];
        if (args[0] instanceof Error) {
            const err = args[0];
            //log = util.format('%s: %s\n%s\npid: %s\n', err.name, err.message, err.stack, process.pid);
            // result.log = log;
            result.level = err.name.toUpperCase();
            result.message = err.message;
            result.stack = err.stack;
            if (ctx && ctx instanceof Object) {
                let req = ctx.request;
                result.ip = ctx.app.getIP(req);
                result.originalUrl = req.originalUrl;
                result.date = ctx.app.getLocalTime();
                result.request = {
                    method: req.method,
                    header: {
                        'Content-Type': ctx.get('Content-Type'),
                        token: ctx.get('auth_token'), // token权限
                    },
                    query: req.query,
                    body: req.body
                }
            }

        } else {
            //log = util.format(...args);
            const message = args[0];
            if (ctx && ctx instanceof Object) {
                let req = ctx.request;
                result.level = `WARNING`;
                result.message = message;
                result.ip = ctx.app.getIP(req);
                result.originalUrl = req.originalUrl;
                result.date = ctx.app.getLocalTime();
                result.request = {
                    query: req.query,
                    body: req.body,
                };
                if (ctx.user) {
                    result.tel_number = ctx.user.tel_number;
                    result.uuid = ctx.user.uuid;
                    result.nickName = ctx.user.nickName;
                    result.realName = ctx.user.realName;
                    result.role = ctx.user.role;
                }
            }
        }
        let loggerEntity = new ctx.model.Logger(result);
        loggerEntity.save();
    }
}

module.exports = UrllibTransport;