'use strict';
let RemoteErrorTransport = require(`../logging/RemoteErrorTransport`)
const Controller = require('./baseController');

class HomeController extends Controller {


    async test(ctx) {
        // ctx.logger.debug('debug info');
        // ctx.logger.info('some request data: %j', ctx.request.body);
        // ctx.logger.warn('WARNNING!!!!');
        this.app.logger.error(new Error('you粗大事了'), ctx);
        //this.app.logger.warn(`我感觉很难受`, ctx);
        // let app = ctx.app
        // this.ctx.app.getLogger('errorLogger').set('remote', new RemoteErrorTransport({level: 'info', app}));
        // console.log(this.ctx.app.getLogger('errorLogger'))
        this.success()
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

