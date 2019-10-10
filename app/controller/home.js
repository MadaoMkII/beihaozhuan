'use strict';
let RemoteErrorTransport = require(`../logging/RemoteErrorTransport`)
const Controller = require('./baseController');

class HomeController extends Controller {


    async test(ctx) {
        try {
            // ctx.logger.debug('debug info');
            // ctx.logger.info('some request data: %j', ctx.request.body);
            // ctx.logger.warn('WARNNING!!!!');
            //this.app.logger.error(new Error('you粗大事了'), ctx);
            //ctx.throw(401,`不要嗑瓜子`)
            let x = ctx.sleep(3000);
            this.success()
            await x;
            console.log(123123131312313)
            //this.app.logger.warn(`我感觉很难受`, ctx);
            // let app = ctx.app
            // this.ctx.app.getLogger('errorLogger').set('remote', new RemoteErrorTransport({level: 'info', app}));
            // console.log(this.ctx.app.getLogger('errorLogger'))

        } catch (e) {
            this.app.logger.error(e, ctx);
            this.failure();
        }

    };


    //
    // async main() {
    //     this.ctx.redirect('back', '/index.html');
    // };
    //
    //
    //


    // async getUserInfo() {
    //     console.log(this.ctx.isAuthenticated())
    //     return this.ctx.body = this.ctx.session.abcv;
    //
    // };

    async getImg(ctx) {

        const svgCaptcha = require('svg-captcha');
        const captcha = svgCaptcha.create();
        ctx.session.captcha = captcha.text;
        ctx.set('Content-Type', 'image/svg+xml');
        ctx.status = 200;
        ctx.body = captcha.data;
    };


}

module.exports = HomeController;

