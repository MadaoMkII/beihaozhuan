`use strict`;
const baseController = require(`../controller/baseController`);
let url = require("url");

class wechatController extends baseController {

    requestMethod(JSONObject, method, url) {
        return new Promise((resolve, reject) => {
            request({
                url: url,
                method: method,
                json: true,   // <--Very important!!!
                body: JSONObject
            }, (error, response, body) => {
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
        const returnUrl = ctx.request.url;
        let urlQuery = url.parse(returnUrl, true).query;


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