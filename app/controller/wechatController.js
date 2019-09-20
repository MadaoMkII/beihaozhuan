`use strict`;
const baseController = require(`../controller/baseController`);
let url = require("url");

class wechatController extends baseController {

    async preLogin(ctx) {
        ctx.status = 301;
        let OPENID = `oopdjjy12`;
        let jumpTo = `register `;
        return ctx.redirect(`/?statusString=${OPENID}&jumpTo=${jumpTo}`);
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

            request_(requestObj, (error, response, body) => {
                if (error) {
                    reject(error)
                } else {
                    resolve([body, response]);
                }
            });
        });
    };

    async loginByOPENID(ctx) {

    };

    async callback(ctx) {

        let returnUrl = ctx.request.url; ///wechat/callback?code=021fx8wK0ooco92PlqwK0YNiwK0fx8wF&state=STATE
        //returnUrl = `/wechat/callback?code=021fx8wK0ooco92PlqwK0YNiwK0fx8wF&state=STATE`;
        let urlQuery = url.parse(returnUrl, true).query;
        const {code, state} = urlQuery;

        if (ctx.helper.isEmpty(code) || ctx.helper.isEmpty(state)) {
            ctx.throw(`空值警告`)
        }
        let requestObj_2 = {
            appid: ctx.app.config.wechatConfig.appid,
            secret: ctx.app.config.wechatConfig.secret,
            code: code,
            grant_type: `authorization_code`
        };

        let [result_2,] = await this.requestMethod(requestObj_2,
            `GET`, `https://api.weixin.qq.com/sns/oauth2/access_token`);
        if (!ctx.helper.isEmpty(result_2[`errcode`])) {
            ctx.throw(405, result_2.errmsg)
        }
        const OPENID = result_2[`openid`];
        let user = await this.ctx.service.userService.getUser({OPENID: OPENID});
        if (!ctx.helper.isEmpty(user)) {

            // await this.ctx.service.userService.updateUser(user.uuid, {
            //     avatar: result_3[`headimgurl`],
            //     nickname: result_3.nickName
            // });
            ctx.login(user);
        } else {
            let requestObj_3 = {
                access_token: result_2.access_token,
                openid: OPENID,
                lang: `zh_CN`
            };
            let [result_3,] = await this.requestMethod(requestObj_3,
                `GET`, `https://api.weixin.qq.com/sns/userinfo`);
            console.log(result_3)
            if (result_3[`errcode`]) {
                return
            }
            //去注册
            let statusString = ctx.helper.encrypt(OPENID);
            let head = ctx.helper.encrypt(result_3[`headimgurl`]);
            let nickName = ctx.helper.encrypt(result_3[`nickname`]);
            console.log(statusString)
            console.log(head)
            console.log(nickName)
            ctx.status = 301;
            ctx.redirect(`/index?statusString=${statusString}&jumpTo=loginInfoBindPhone&head=${head}&nickName=${nickName}`);
        }

    }
}

module.exports = wechatController;