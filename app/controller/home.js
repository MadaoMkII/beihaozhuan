'use strict';

const Controller = require('./baseController');

class HomeController extends Controller {


    async test(ctx) {
        ctx.logger.debug('debug info');
        ctx.logger.info('some request data: %j', ctx.request.body);
        ctx.logger.warn('WARNNING!!!!');
        ctx.logger.error(new Error('粗大事了'));
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

