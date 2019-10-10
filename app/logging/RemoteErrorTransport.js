const Transport = require('egg-logger').Transport;


class RemoteErrorTransport extends Transport {

    log(level, args, meta) {
        let result = {};
        let ctx = args[1];
        if (args[0] instanceof Error) {
            const err = args[0];
            //log = util.format('%s: %s\n%s\npid: %s\n', err.name, err.message, err.stack, process.pid);
            // result.log = log;
            result.level = `ERROR`;
            result.reason = err.name.toUpperCase();
            result.message = err.message;
            result.stack = err.stack;
            if (ctx && ctx instanceof Object) {
                let req = ctx.request;
                result.ip = ctx.app.getIP(req);
                result.originalUrl = req.originalUrl;
                result.date = new Date();
                if (ctx.user) {
                    result.tel_number = ctx.user.tel_number;
                    result.uuid = ctx.user.uuid;
                    result.nickName = ctx.user.nickName;
                    result.realName = ctx.user.realName;
                    result.role = ctx.user.role;
                }
                result.request = {
                    method: req.method,
                    header: req.headers,
                    query: req.query,
                    body: req.body
                }
            } else {
                ctx = this.options.app.createAnonymousContext();
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
                result.date = new Date();
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
            } else {
                result.level = `WARNING`;
                result.message = message;
                result.date = new Date();
                ctx = this.options.app.createAnonymousContext();
            }
        }
        let loggerEntity = new ctx.model[`Logger`](result);
        loggerEntity.save();
    }
}

module.exports = RemoteErrorTransport;