/* eslint valid-jsdoc: "off" */

'use strict';
const path = require('path');
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
            },
            analyze: {
                url: 'mongodb://root:!beihaozhuan1467@dds-8vbf8f7ecc1929641611-pub.mongodb.zhangbei.rds.aliyuncs.com:3717,dds-8vbf8f7ecc1929642870-pub.mongodb.zhangbei.rds.aliyuncs.com:3717/admin?replicaSet=mgset-500096173',
                options: {
                    poolSize: 6,
                    keepAlive: true,
                    dbName: `beihaozhuan_analyzeData`,
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
        domainWhiteList: ['http://localhost:8080', 'http://127.0.0.1:3000', `http://localhost:3000`]
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
            https: {
                key: '/certificate/2676355__beihaozhuan.com.key',
                cert: '/certificate/2676355__beihaozhuan.com.pem'
            }
        }
    };
    //config.domainWhiteList = ['http://localhost:4200', 'http://localhost:8080', 'http://127.0.0.1:3000'];
    // add your user config here
    const userConfig = {
        // myAppName: 'egg',
    };
    config.wechatConfig = {
        appid: `wx87462aaa978561bf`,   //`wx6da0f69da7e8894c`,
        secret: `9205cff5cae37c4d7539822650ad9dc5`     //`b6b0fb92a432acb9963bc4cf54e507fc`,
    };
    config.session = {
        key: 'yhbSen',
        maxAge: 24 * 3600 * 1000, // 1 天
        httpOnly: true,
        encrypt: true,
    };

    config.onerror = {
        all(err, ctx) {
            // 在此处定义针对所有响应类型的错误处理方法
            // 注意，定义了 config.all 之后，其他错误处理方法不会再生效
            ctx.body = JSON.stringify({message: '服务器内部忙碌，请稍后再试'});
            ctx.set('Content-Type', 'application/json; charset=utf-8');
            ctx.status = 503;
        },
        html(err, ctx) {
            // html hander
            ctx.body = '<h3>error</h3>';
            ctx.status = 500;
        },
        json(err, ctx) {
            // json hander
            ctx.body = {message: 'error'};
            ctx.status = 500;
        },
        jsonp(err, ctx) {
            // 一般来说，不需要特殊针对 jsonp 进行错误定义，jsonp 的错误处理会自动调用 json 错误处理，并包装成 jsonp 的响应格式
        },
    };

    config.notfound = {
        pageUrl: '/index',
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
    // config/config.default.js
    exports.alinode = {
        server: 'wss://agentserver.node.aliyun.com:8080',
        appid: '81576   ',
        secret: '660b93ceef24cb6d5621419e16c53d645d1bddd6',
        logdir: `${appInfo.baseDir}/logs/`,
        // error_log: [
        //     '您的应用在业务层面产生的异常日志的路径，数组，可选，可配置多个',
        //     '例如：/root/.logs/error.#YYYY#-#MM#-#DD#.log',
        //     '不更改 Egg 默认日志输出路径可不配置本项目',
        // ],
        //agentidMode:'IP' '可选，如果设置，则在实例ID中添加部分IP信息，用于多个实例 hostname 相同的场景（以容器为主）'


        packages: [
            path.join(appInfo.baseDir, 'package.json'),
        ],
        error_log: [
            path.join(appInfo.baseDir, 'logs/' + appInfo.name + `/${appInfo.name}-common-error.log`),
            path.join(appInfo.baseDir, 'logs/' + appInfo.name + `/${appInfo.name}-egg-web.log`),
            path.join(appInfo.baseDir, 'logs/' + appInfo.name + `/${appInfo.name}-egg-agent.log`),
            path.join(appInfo.baseDir, 'logs/' + appInfo.name + `/${appInfo.name}-web-running.log`),
        ]
    };

    exports.logrotator = {
        "filesRotateByHour": [
            path.join(appInfo.root, '/logs/', appInfo.name, '-common-error.log')
        ]
    };
    exports.logger = {
        "dir": `${appInfo.baseDir}/logs/${appInfo.name}`,
        // "encoding": "utf8",
        // "env": "prod",
        // "level": "INFO",
        // "consoleLevel": "INFO",
        // "disableConsoleAfterReady": true,
        // "outputJSON": true,
        // "buffer": true,
        // "allowDebugAtProd": true,
        // "type": "application",
        appLogName: `${appInfo.name}-web-running.log`,
        coreLogName: `${appInfo.name}-egg-web.log`,
        agentLogName: `${appInfo.name}-egg-agent.log`,
        errorLogName: `${appInfo.name}-common-error.log`,
    };
    return {
        ...config,
        ...userConfig,
    };
};


