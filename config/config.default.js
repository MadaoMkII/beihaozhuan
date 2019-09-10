/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
    /**
     * built-in config
     * @type {Egg.EggAppConfig}
     **/
    const config = exports = {};
    config.mongoose = {
        clients: {
            userConnection: {
                url: 'mongodb://root:!beihaozhuan1467@dds-8vbf8f7ecc1929641611-pub.mongodb.zhangbei.rds.aliyuncs.com:3717,dds-8vbf8f7ecc1929642870-pub.mongodb.zhangbei.rds.aliyuncs.com:3717/admin?replicaSet=mgset-500096173',
                options: {
                    poolSize: 6,
                    keepAlive: true,
                    dbName: `beihaozhuan_userConnection`,
                    useCreateIndex: true,
                    useFindAndModify: false,
                },
            },
            orderGoodConnection: {
                url: 'mongodb://root:!beihaozhuan1467@dds-8vbf8f7ecc1929641611-pub.mongodb.zhangbei.rds.aliyuncs.com:3717,dds-8vbf8f7ecc1929642870-pub.mongodb.zhangbei.rds.aliyuncs.com:3717/admin?replicaSet=mgset-500096173',
                options: {
                    poolSize: 6,
                    keepAlive: true,
                    dbName: `beihaozhuan_orderGood`,
                    useCreateIndex: true,
                    useFindAndModify: false,
                },
            },
            loggerConnection: {
                url: 'mongodb://root:!beihaozhuan1467@dds-8vbf8f7ecc1929641611-pub.mongodb.zhangbei.rds.aliyuncs.com:3717,dds-8vbf8f7ecc1929642870-pub.mongodb.zhangbei.rds.aliyuncs.com:3717/admin?replicaSet=mgset-500096173',
                options: {
                    poolSize: 6,
                    keepAlive: true,
                    dbName: `beihaozhuan_logger`,
                    useCreateIndex: true,
                    useFindAndModify: false,
                }
            },
            missionTracker: {
                url: 'mongodb://root:!beihaozhuan1467@dds-8vbf8f7ecc1929641611-pub.mongodb.zhangbei.rds.aliyuncs.com:3717,dds-8vbf8f7ecc1929642870-pub.mongodb.zhangbei.rds.aliyuncs.com:3717/admin?replicaSet=mgset-500096173',
                options: {
                    poolSize: 6,
                    keepAlive: true,
                    dbName: `beihaozhuan_missionTracker`,
                    useCreateIndex: true,
                    useFindAndModify: false,
                }
            },
            commonConnection: {
                url: 'mongodb://root:!beihaozhuan1467@dds-8vbf8f7ecc1929641611-pub.mongodb.zhangbei.rds.aliyuncs.com:3717,dds-8vbf8f7ecc1929642870-pub.mongodb.zhangbei.rds.aliyuncs.com:3717/admin?replicaSet=mgset-500096173',
                options: {
                    poolSize: 6,
                    keepAlive: true,
                    dbName: `beihaozhuan_common`,
                    useCreateIndex: true,
                    useFindAndModify: false,
                }
            }
        }
    };
    // use for cookie sign key, should change to your own and keep security
    config.keys = appInfo.name + '_1562732382211_2587';

    // add your middleware config here
    config.middleware = [];
    config.security = {
        csrf: {
            //useSession: true, // 默认为 false，当设置为 true 时，将会把 csrf token 保存到 Session 中
            enable: false,
            ignoreJSON: false
        },
        domainWhiteList: ['http://localhost:8080', 'http://127.0.0.1:3000']
    };
    config.cors = {
        origin: 'http://localhost:3000',
        allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
        credentials: true
    };
    config.proxy = true;
    config.cluster = {
        listen: {
            port: 3000,
        }
    };
    //config.domainWhiteList = ['http://localhost:4200', 'http://localhost:8080', 'http://127.0.0.1:3000'];
    // add your user config here
    const userConfig = {
        // myAppName: 'egg',
    };
    config.session = {
        key: 'yhbSen',
        maxAge: 24 * 3600 * 1000, // 1 天
        httpOnly: true,
        encrypt: true,
    };


    config.notfound = {
        pageUrl: '/404.html',
    };


    config.smsConfig = {
        APPID: '38798',
        APPKEY: 'e665567672d5da9ea6b238bc4051916c',
        modelCode: '6BQ3F'
    };
    config.saltword = "RX78";
    config.secretKey = "GP02A";

    exports.eventDictionary = function () {
        let dictionaryMap = new Map();
        dictionaryMap.set(``, ``);


    };
    //config.middleware = ['authenticatedMiddleware'];

    // 配置 gzip 中间件的配置
    // config.authenticatedMiddleware = {
    //     threshold: 78, // 小于 1k 的响应体不压缩
    // };

    config.validate = {
        //convert: true,
        widelyUndefined: true
    };
    exports.oss = {
        client: {
            accessKeyId: 'LTAIlugD8eplwSvl',
            accessKeySecret: 'm1N0sCsqm7qdeVeMHk6KTzSrpDAg9c',
            bucket: 'beihaozhuan',
            endpoint: 'https://oss-cn-zhangjiakou.aliyuncs.com',
            timeout: '60s',
            bucketUrl: 'https://beihaozhuan.oss-cn-zhangjiakou.aliyuncs.com'
        },
    };
    const path = require('path');
    exports.static = {

        // maxAge: 31536000,
        prefix: '/',
        dir: path.join(appInfo.baseDir, 'app/public'),
        dynamic: true
    };
    exports.view = {
        // defaultViewEngine: '.ejs',
        mapping: {
            '.html': 'ejs',
            '.ejs': 'ejs',
        }
    };
    exports.multipart = {
        autoFields: true,
        mode: 'file',
        defaultCharset: 'utf8',
        fieldNameSize: 100,
        fieldSize: '100kb',
        fields: 100,
        fileSize: '2048mb',
        files: 100,
        fileExtensions: [``],
    };

    exports.email = {
        user: "sendmail@yubaopay.com.tw",
        username: 'sendmail@yubaopay.com.tw',
        password: 'Yubao888888',
    };
    config.validatePlus = {
        resolveError(ctx, errors) {
            if (errors.length) {
                ctx.type = 'json';
                ctx.status = 400;
                ctx.body = {
                    code: 400,
                    error: errors,
                    message: '参数错误',
                };
            }
        }
    };
    return {
        ...config,
        ...userConfig,
    };
}
;

