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
    };

    deepCleanUp(object, newProperty, ...properties) {
        properties.forEach((property) => {
            if (!this.ctx.helper.isEmpty(object[property])) {
                object[newProperty] = {};
                object[newProperty][property] = object[property];
                delete object[property];
            }
        });
    };

    operatorGenerator(unit, page, DESC = false) {
        // let operator = {sort: {updated_at: -1}};
        let operator = {};
        if (DESC) {
            operator.sort = {updated_at: -1};
        }
        if (unit && page) {
            if (page < 1 || unit < 1) {
                this.throw(400, `page or unit can not less than 1`);
            }
            operator.skip = (parseInt(page) - 1) * parseInt(unit);
            operator.limit = parseInt(unit);
        }
        return operator;
    };

    async cleanupRequest(avoidPropertyArray, ...obj) {
        let res = {};
        for (let objElement of obj) {
            if (!this.ctx.helper.isEmpty(objElement)) {
                Object.keys(objElement).forEach((key) => {
                    if (!this.ctx.helper.isEmpty(objElement[key]) && !avoidPropertyArray.includes(key)) {
                        res[key] = objElement[key];
                    }
                });
            }
        }
        return res;
    };

    async cleanupRequestProperty(ruleName, ...properties) {
        let requestEntity = {};

        properties.forEach((propertyName) => {
            requestEntity[propertyName] = this.ctx.request.body[propertyName];
        });

        let validateResult = true;
        let option = null;
        if (ruleName) {
            validateResult = await this.ctx.validate(ruleName, requestEntity);
        }

        if (properties.includes(`unit`) || properties.includes(`page`)) {
            validateResult = validateResult && await this.ctx.validate(`pageAndUnitRule`, requestEntity);
            option = this.operatorGenerator(requestEntity[`unit`], requestEntity[`page`]);
        }

        if (!validateResult) {
            return new Promise((resolve) => {
                resolve([false, false]);
            });
        }
        const condition = await this.cleanupRequest([`unit`, `page`], requestEntity);

        return new Promise((resolve) => {
                resolve([condition, option]);
            }
        );
    };


    // validateError(err) {
    //     const ctx = this.ctx;
    //
    //     ctx.body = {
    //         code: '422',
    //         msg: ctx.helper.errorCode['422'],
    //         result: err.errors,
    //     };
    //     ctx.status = 200;
    // }
    //
    // microserviceError(err) {
    //     const ctx = this.ctx;
    //
    //     ctx.logger.error('微服务调用异常', err);
    //     const isEnvProd = ctx.app.config.env === 'prod';
    //
    //     this.failure({
    //         code: 900,
    //         state: 200,
    //         msg: ctx.helper.errorCode[900],
    //         data: !isEnvProd ? err : {},
    //     });
    // }
}

module.exports = BaseController;
