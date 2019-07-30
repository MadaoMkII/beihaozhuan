'use strict';

const {Controller} = require('egg');

class BaseController extends Controller {
    success(data, msg = "OK", state = 200) {
        const {ctx} = this;
        ctx.body = {
            code: '0',
            msg: msg,
        };
        if (data) {
            ctx.body.data = data;
        }
        ctx.status = state;
    };

    failure(msg, state = 503) {
        const {ctx} = this;
        //const defaultCode = (state >= 200 && state < 300) ? 0 : state;

        ctx.body = {
            code: state,//String(code || defaultCode),
            msg: msg || ctx.helper.errorCode[String(state)],
        };
        ctx.status = state;
    }

    validateError(err) {
        const ctx = this.ctx;

        ctx.body = {
            code: '422',
            msg: ctx.helper.errorCode['422'],
            result: err.errors,
        };
        ctx.status = 200;
    }

    microserviceError(err) {
        const ctx = this.ctx;

        ctx.logger.error('微服务调用异常', err);
        const isEnvProd = ctx.app.config.env === 'prod';

        this.failure({
            code: 900,
            state: 200,
            msg: ctx.helper.errorCode[900],
            data: !isEnvProd ? err : {},
        });
    }
}

module.exports = BaseController;
