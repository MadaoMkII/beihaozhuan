'use strict';
const { DateTime } = require('luxon');
const { Controller } = require('egg');

class BaseController extends Controller {
  constructor(ctx) {
    super(ctx);
    this.isEmpty = ctx.app.isEmpty;
  }
  async uploadAndSetPics(condition, picsArrayName = 'slideShowPicUrlArray', singlePicName = 'mainlyShowPicUrl') {
    const files = this.ctx.request.files;
    if (!this.isEmpty(files)) {
      for (const fileObj of files) {
        const ossUrl = await this.ctx.service.picService.putImgs(fileObj);
        if (fileObj.field !== 'mainlyShowPicUrl') {
          condition[picsArrayName].push(ossUrl);
        } else {
          condition[singlePicName] = ossUrl;
        }
      }
    }
  }
  async checkTimeInterval(interval) {
    const ctx = this.ctx;
    let lastTime = ctx.cookies.get('lastCallTime');
    if (!ctx.helper.isEmpty(lastTime)) {
      lastTime = DateTime.fromMillis(Number(lastTime));
      const nowDate = DateTime.fromJSDate(new Date());
      const diffTime = nowDate.diff(lastTime, 'minutes');
      if (diffTime.minutes < interval) {
        return ctx.throw(200, `接口调用间隔必须大于${interval}分钟`);
      }
    }
    ctx.cookies.set('lastCallTime', Date.now().toString());
  }

  requestMethod(JSONObject, method, url) {
    const request_ = require('request');
    let requestObj = {};
    if (method === 'GET') {
      const myURL = new URL(url);
      Object.keys(JSONObject).forEach(key => {
        myURL.searchParams.append(key, JSONObject[key]);
      });
      requestObj = {
        url: myURL.href,
        method,
        json: true, // <--Very important!!!
      };
    }
    if (method === 'POST') {
      requestObj = {
        url,
        method,
        json: true, // <--Very important!!!
        body: JSONObject,
      };
    }
    return new Promise((resolve, reject) => {

      request_(requestObj, (error, response, body) => {
        if (error) {
          reject(error);
        } else {
          resolve([ body, response ]);
        }
      });
    });
  }

  success(data, msg = 'OK', state = '0') {
    const { ctx } = this;
    ctx.body = {
      code: state,
      msg,
    };
    if (!ctx.helper.isEmpty(data)) {

      if (Array.isArray(data) && data.length === 2 && !isNaN(data[1])) {
        ctx.body.count = data[1];
        ctx.body.data = data[0];
        // ctx.body = Object.assign(ctx.body, {count: data[1]});
      } else {
        ctx.body.data = data;
      }
    }

    ctx.status = 200;
  }

  failure(message, msgState, state = 503) {
    console.log(message);
    const { ctx } = this;


    // const defaultCode = (state >= 200 && state < 300) ? 0 : state;
    if (typeof message === 'object') {
      ctx.body = {
        code: message.status, // String(code || defaultCode),
        message: message.message,
      };
      if (message.status) { ctx.status = message.status; } else { ctx.status = 503; }

    } else {
      ctx.body = {
        code: msgState, // String(code || defaultCode),
        message: message || ctx.helper.errorCode[String(state)],
      };
      ctx.status = state;
    }
  }

  deepCleanUp(object, newProperty, ...properties) {
    properties.forEach(property => {
      if (!this.ctx.helper.isEmpty(object[property])) {
        object[newProperty] = {};
        object[newProperty + '.' + property] = object[property];
        delete object[property];
      }
    });
    delete object[newProperty];
  }

  operatorGenerator(unit, page, DESC = false) {
    // let operator = {sort: {updated_at: -1}};
    const operator = {};
    if (DESC) {
      operator.sort = { updated_at: -1 };
    }
    if (unit && page) {
      if (page < 1 || unit < 1) {
        this.throw(400, 'page or unit can not less than 1');
      }
      operator.skip = (parseInt(page) - 1) * parseInt(unit);
      operator.limit = parseInt(unit);
    }
    return operator;
  }

  async cleanupRequest(avoidPropertyArray, ...obj) {
    const res = {};
    for (const objElement of obj) {
      if (!this.ctx.helper.isEmpty(objElement)) {
        Object.keys(objElement).forEach(key => {
          if (!this.ctx.helper.isEmpty(objElement[key]) && !avoidPropertyArray.includes(key)) {
            res[key] = objElement[key];
          }
        });
      }
    }
    return res;
  }

  async cleanupRequestProperty(ruleName, ...properties) {
    const requestEntity = {};

    properties.forEach(propertyName => {
      if (this.ctx.request.method === 'GET') {
        requestEntity[propertyName] = this.ctx.request.query[propertyName];
      } else {
        requestEntity[propertyName] = this.ctx.request.body[propertyName];
      }
    });

    let validateResult = true;
    let option = null;
    if (ruleName) {
      validateResult = await this.ctx.validate(ruleName, requestEntity);
    }

    if (properties.includes('unit') || properties.includes('page')) {
      // validateResult = validateResult && await this.ctx.validate('pageAndUnitRule', requestEntity);
      option = this.operatorGenerator(Number(requestEntity.unit), Number(requestEntity.page));
    }

    if (!validateResult) {
      return new Promise(resolve => {
        resolve([ false, false ]);
      });
    }
    const condition = await this.cleanupRequest([ 'unit', 'page' ], requestEntity);

    return new Promise(resolve => {
      resolve([ condition, option ]);
    }
    );
  }

  async getFindModelCount(modelName, conditions) {
    const count = await this.ctx.model[modelName].countDocuments(conditions);
    return this.ctx.helper.isEmpty(count) ? 0 : count;
  }

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
