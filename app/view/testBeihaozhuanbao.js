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
            "Cookie": "SESSION=1af8a0ed-f7f7-4578-ba7a-2af272eb235e; SERVERID=e4ef0ed207aa77fa33d12fea4f834597|1569044299|1569038361"
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


(async function () {


    let XLSX = require(`xlsx`);

    let url = `https://www.94mxd.com/mxd/channelqrcode/list`;


    function find(str, cha, num) {
        str = str.replace(`null`, ``);
        let x = str.indexOf(cha);
        for (let i = 0; i < num; i++) {
            x = str.indexOf(cha, x + 1);
        }
        return x;
    }

    //
    // let cookie = str.split(';').reduce((cookieObject, cookieString) => {
    //     let splitCookie = cookieString.split('=')
    //     try {
    //         cookieObject[splitCookie[0].trim()] = decodeURIComponent(splitCookie[1])
    //     } catch (error) {
    //         cookieObject[splitCookie[0].trim()] = splitCookie[1]
    //     }
    //     return cookieObject
    // }, [])

    let pageSize = 1;
    let adminArray = [];
    for (let index = 1; index <= pageSize; index++) {
        let [body,] = await requestMethod({groupId: 0, appId: "wx87462aaa978561bf", pageNum: index}, `GET`, url);
        adminArray.push.apply(adminArray, body.respMsg.list);
        pageSize = body.respMsg.pagInfo.pages;
    }

    let getDetailUrl = "https://www.94mxd.com/mxd/channelqrcode/fanslist";
    let workbook = XLSX.utils.book_new();
    for (let admin of adminArray) {
        await sleep(300)
        let jsonOfAdmin = await getLoop(admin.id, getDetailUrl, admin.name);
        let worksheet = await XLSX.utils.json_to_sheet(jsonOfAdmin);
        XLSX.utils.book_append_sheet(workbook, worksheet, admin.name);
    }


    XLSX.writeFile(workbook, "eva00.xlsx");
})();

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function getLoop(qrcodeId, url, name) {

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
        }, `GET`, url);
        for (let document of adminBody.respMsg.list) {
            let tempDocument = {};
            tempDocument.粉丝 = document.nickname;
            tempDocument.扫码时间 = getLocalTime(timeStamp2String(document.scandate));
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


        pageSize = adminBody.respMsg.pagInfo.pages;
        total = adminBody.respMsg.pagInfo.total;
    }

    console.log(`爬 '${name}' 结束, 一共 ${total} 条结果`);
    return tempArray;
}

let getLocalTime = function (date) {
    const moment = require(`moment`);
    require(`moment-timezone`);
    return moment.tz(date, "Asia/ShangHai").format(`YYYY/MM/DD HH:mm:ss`);
};
let timeStamp2String = (time) => {
    let datetime = new Date();
    datetime.setTime(time);
    return datetime
}