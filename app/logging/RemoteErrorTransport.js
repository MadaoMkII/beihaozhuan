const util = require('util');
const Transport = require('egg-logger').Transport;

class RemoteErrorTransport extends Transport {

    // 定义 log 方法，在此方法中把日志上报给远端服务


        // this.options.app.curl('http://url/to/remote/error/log/service/logs', {
        //     data: log,
        //     method: 'POST',
        // }).catch(console.error);

}

module.exports = RemoteErrorTransport;
