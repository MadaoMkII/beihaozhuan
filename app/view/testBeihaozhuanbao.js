let requestMethod = (JSONObject, method, url) => {
    const request_ = require("request");
    let requestObj = {};
    if (method === `GET`) {
        const myURL = new URL(url);
        Object.keys(JSONObject).forEach((key) => {
            myURL.searchParams.append(key, JSONObject[key]);
        });
        let headers = {
            "User-Agent":"\tMozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36",
            "Sec-Fetch-Mode":"cors",
            "Accept":"*/*",
            "Sec-Fetch-Site":"cross-site",
            "Accept-Encoding":"gzip, deflate, br",
            "Accept-Language":"zh-CN,zh;q=0.9",
            "Cookie":"SESSION=717dd8f4-dea5-41e4-b216-121759efe761; SERVERID=7b74f0f837bd29e9d1e95acb52b90183|1568982201|1568980987"
        };
        requestObj = {
            headers: headers,
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


(async function () {
    const zlib = require('zlib');
    let url = `https://www.94mxd.com/mxd/channelqrcode/fanslist`;
    let [a,c] = await requestMethod({qrcodeId: 5213, subscribe: -1, pageNum: 1, appId: `wx87462aaa978561bf`}, `GET`, url);


    console.log(a)
})();
