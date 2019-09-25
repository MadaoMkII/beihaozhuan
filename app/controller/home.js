'use strict';

const Controller = require('./baseController');

class HomeController extends Controller {
    async index() {
        const ctx = this.ctx;
        let result = await ctx.oss.list({
            prefix: `images/`
        });
        delete result.objects[0];
        await this.ctx.render('index.ejs', {
            files: result.objects
        })

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

