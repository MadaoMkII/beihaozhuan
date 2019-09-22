let express = require(`express`);
let bodyParser = require('body-parser');
let XLSX = require(`xlsx`);
let app = express();
let fileName = "none";
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/about', function (req, res) {
    if (fileName === `none`) {
        res.status(200);
        return res.json({status: "需要先生成文件"});
    }
    res.status(200).download(fileName);
    fileName = `none`;
});

app.post('/beginScanning', async function (req, res) {

    let {cookieStr} = req.body;
    let pageSize = 1;
    let adminArray = [];
    let url = `https://www.94mxd.com/mxd/channelqrcode/list`;
    let cookie = cookieStr;//`SESSION=78747dc6-774e-4713-a3d0-63787044c4ce;SERVERID=e4ef0ed207aa77fa33d12fea4f834597|1569162097|1569162090`
    for (let index = 1; index <= pageSize; index++) {
        let [body,] = await requestMethod({
            groupId: 0,
            appId: "wx87462aaa978561bf",
            pageNum: index
        }, `GET`, url, cookie);
        if (body.description === `login expired`) {
            res.status(200);
            return res.send(`Cookie 过期了，请重新复制`);

        }
        adminArray.push.apply(adminArray, body[`respMsg`].list);
        pageSize = body[`respMsg`][`pagInfo`].pages;
    }
    res.status(200);
    res.send({data: `读取成功，请等待30秒后 调用下载接口`, status: 1});

    let getDetailUrl = "https://www.94mxd.com/mxd/channelqrcode/fanslist";
    let workbook = XLSX.utils.book_new();
    let rowInfo = [
        {hpx: 30}
    ];

    for (let admin of adminArray) {
        await sleep(300);
        let jsonOfAdmin = await getLoop(admin.id, getDetailUrl, admin.name, cookie);
        let wsCols = [
            {wch: 25},
            {wch: 20},
            {wch: 10},
            {wch: 10}
        ];
        let tempRowInfo = Array.from(rowInfo);
        tempRowInfo.push({hpx: 20});
        let worksheet = await XLSX.utils.json_to_sheet(jsonOfAdmin);
        worksheet['!cols'] = wsCols;
        worksheet['!rows'] = tempRowInfo;
        XLSX.utils.book_append_sheet(workbook, worksheet, admin.name);
    }
    await sleep(1000);
    console.log(`全部爬完，开始写入数据.....`);
    fileName = `${getLocalTimeForFileName(new Date())}.xlsx`;
    XLSX.writeFile(workbook, fileName);
    console.log(`写入文件成功`);

});

// 4 .启动服务
app.listen(3000, function () {
    console.log('app is running at port 3000.')
});

let requestMethod = (JSONObject, method, url, cookie) => {
    const request_ = require("request");
    let requestObj = {};
    if (method === `GET`) {
        const myURL = new URL(url);
        Object.keys(JSONObject).forEach((key) => {
            myURL.searchParams.append(key, JSONObject[key]);
        });
        let headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36",
            "Sec-Fetch-Mode": "cors",
            "Accept": "*/*",
            "Sec-Fetch-Site": "cross-site",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "zh-CN,zh;q=0.9",
            "Cookie": cookie
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
let getLoop = async (qrcodeId, url, name, cookie) => {

    let pageSize = 1;
    let tempArray = [];
    let total;
    for (let index = 1; index <= pageSize; index++) {
        console.log(`开始爬 ${name}  第 ${index} 页`);
        await sleep(100);

        let [adminBody,] = await requestMethod({
            subscribe: -1,
            qrcodeId: qrcodeId,
            appId: "wx87462aaa978561bf",
            pageNum: index
        }, `GET`, url, cookie);
        for (let document of adminBody[`respMsg`].list) {
            let tempDocument = {};
            tempDocument.粉丝 = document[`nickname`];
            tempDocument.扫码时间 = getLocalTime(timeStamp2String(document[`scandate`]));
            switch (document.subscribe) {
                case 1:
                    tempDocument.关注状态 = `关注中`;
                    break;
                case 0:
                    tempDocument.关注状态 = `取消关注`;
                    break;
                default :
                    tempDocument.关注状态 = `未知状态`;
                    break;
            }
            switch (document.status) {
                case 1:
                    tempDocument.类型 = `新粉丝`;
                    break;
                case 2:
                    tempDocument.类型 = `老粉丝`;
                    break;
                default :
                    tempDocument.类型 = `未知类型`;
                    break;
            }
            tempArray.push(tempDocument);
        }


        pageSize = adminBody[`respMsg`][`pagInfo`].pages;
        total = adminBody[`respMsg`][`pagInfo`].total;
    }

    console.log(`爬 '${name}' 结束, 一共 ${total} 条结果`);
    return tempArray;
};
let getLocalTime = function (date) {
    const moment = require(`moment`);
    require(`moment-timezone`);
    return moment.tz(date, "Asia/ShangHai").format(`YYYY/MM/DD HH:mm:ss`);
};
let timeStamp2String = (time) => {
    let datetime = new Date();
    datetime.setTime(time);
    return datetime
};
let getLocalTimeForFileName = function (date) {
    const moment = require(`moment`);
    require(`moment-timezone`);
    return moment.tz(date, "Asia/ShangHai").format(`YYYY年MM月DD日 HH时mm分ss秒`);
};