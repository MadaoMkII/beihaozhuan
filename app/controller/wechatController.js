`use strict`;
const baseController = require(`../controller/baseController`);
let url = require("url");

class wechatController extends baseController {

    async pre_login(OPENID) {

        await this.ctx.service.userservice.getUser({OPENID: OPENID});
    };


    requestMethod(JSONObject, method, url) {
        const request_ = require("request");
        let requestObj = {};
        if (method === `GET`) {
            const myURL = new URL(url);
            Object.keys(JSONObject).forEach((key) => {
                myURL.searchParams.append(key, JSONObject[key]);
            });
            requestObj = {
                url: myURL.href,
                method: method,
                json: true,   // <--Very important!!!
            }
        }
        if (method === `POST`) {
            requestObj = {
                url: url,
                method: method,
                json: true,   // <--Very important!!!
                body: JSONObject
            }
        }
        return new Promise((resolve, reject) => {
            console.log(requestObj)
            request_(requestObj, (error, response, body) => {
                if (error) {
                    reject(error)
                } else {
                    resolve([body, response]);
                }
            });
        });
    };

    async callback(ctx) {
        console.log(ctx.request)
        let returnUrl = ctx.request.url; ///wechat/callback?code=021fx8wK0ooco92PlqwK0YNiwK0fx8wF&state=STATE
        returnUrl = `/wechat/callback?code=021fx8wK0ooco92PlqwK0YNiwK0fx8wF&state=STATE`;
        let urlQuery = url.parse(returnUrl, true).query;
        const {code, state} = urlQuery;
        console.log(code)
        console.log(state)
        if (ctx.helper.isEmpty(code) || ctx.helper.isEmpty(state)) {
            ctx.throw(`空值警告`)
        }
        let requestObj_2 = {
            appid: ctx.app.config.wechatConfig.appid,
            secret: ctx.app.config.wechatConfig.secret,
            code: code,
            grant_type: `authorization_code`
        };
        console.log(requestObj_2)
        let [result, ] = await this.requestMethod(requestObj_2, `GET`, `https://api.weixin.qq.com/sns/oauth2/access_token`);
        console.log(result)

        if(!ctx.helper.isEmpty(result.errcode) ){

            ctx.throw(405,result.errmsg)

        }
        let user = await this.ctx.service.userService.getUser({openID: result[`openid`]});
        let alreadyExistFlag = false;
        if (!ctx.helper.isEmpty(user)) {

            alreadyExistFlag = true;
        }
        let access_token = result.access_token;
        switch (urlQuery) {
            case `login`:

                break;

            case `scan`:
                break;

            default :
                break;
        }

        this.success();
    }
}

module.exports = wechatController;