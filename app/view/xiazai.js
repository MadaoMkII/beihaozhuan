let {DateTime} = require('luxon');
let url = require("url");
let express = require(`express`);
let bodyParser = require('body-parser');
let XLSX = require(`xlsx`);
let app = express();
const fs = require('fs');
const path = require('path');
let fileName = "none";
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
const cors = require('cors');
app.use(cors());


app.post('/getReport', async (req, res) => {


    let returnUrl = req.body.cookieStr;
    //returnUrl = `https://www.567pan.com/file-${returnUrl}.html`;
    let urlQuery = url.parse(returnUrl, true).pathname.replace(`/file-`, ``).replace(`.html`, ``);
    let queryObj = {
        type: "567new",
        fileId: urlQuery,
        userAgent: "Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.2; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; .NET CLR 2.0.50727; .NET CLR 3.0.30729; .NET CLR 3.5.30729; InfoPath.3)"
    };
    let [resBody,] = await requestMethod(queryObj, "GET", `http://www.qianxunsw.com/WebForm1.aspx`);

    let realUrl = resBody.toString().split(`<!DOCTYPE html>`)[0].trim();

    let queryObj_2 = {
        url: realUrl,
        cookies: "phpdisk_zcore_v2_info=cd7dRDmUWDUPNpRbn9xQ33O9QsGIOs6VJI5GYVvEy170j8UU%2FZR5stbRdT7DavZdIn2hqvgcJ8Cmw9%2BRgd2Em3JcLYhE6jbW%2FiZP1B7iHQDH4aj8liz%2F2YDFBdtqQA;",
        refer: returnUrl
    };

    const myURL = new URL(`http://122.114.229.187:8082/xl.html`);
    Object.keys(queryObj_2).forEach((key) => {
        myURL.searchParams.append(key, queryObj_2[key]);
    });
    res.type("html");
    res.json({Url: decodeURIComponent(myURL.toString())});
});
app.get('/', async (req, res) => {
    res.type("html");
    let html = fs.readFileSync(path.resolve(__dirname, './getCookie.html'));
    res.send(html)
    // ctx.redirect('/index.html')
});


// 4 .启动服务
app.listen(3200, function () {
    console.log('app is running at port 3000.');
});

let requestMethod = (JSONObject, method, url) => {
    const request_ = require("request");
    let requestObj = {};
    if (method === `GET`) {
        const myURL = new URL(url);
        Object.keys(JSONObject).forEach((key) => {
            myURL.searchParams.append(key, JSONObject[key]);
        });
        let headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36",
            // "Sec-Fetch-Mode": "cors",
            "Accept": "*/*",
            // "Sec-Fetch-Site": "cross-site",
            // "Accept-Encoding": "gzip, deflate, br",
            // "Accept-Language": "zh-CN,zh;q=0.9",
            //"Cookie": cookie
        };
        requestObj = {
            gzip: true,
            headers: headers,
            url: myURL.href,
            method: method,
            json: true,   // <--Very important!!!
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
let sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};
