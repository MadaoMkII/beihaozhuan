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

    async main() {

        let x = this.app.encrypt(String(1234));


        let aa= this.app.decrypt(x);




        this.ctx.body = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>LoginPage</title>
</head>
<body>
    <form action="/verify/verifyCaptTxt" method="post">
        <input type="hidden" name="_csrf" value="${this.ctx.csrf}">
        <label for="captchaTxt">
            verifyCode:
            <input type="text" value="" id="captchaTxt" name="captchaTxt">
        </label>
        <!--<label for="password">-->
            <!--Password:-->
            <!--<input type="text" value="pass1" id="password" name="password">-->
        <!--</label>-->
        <input type="submit" value="Submit">
        <img src="http://127.0.0.1:7001/verify/getImg">
    </form>
</body>
</html>`;
    };


    async addUser(ctx) {
        let body = ctx.request.body;
        let result = await this.service.user.addUser({username: body.username, password: body.password});
        ctx.body = result;
    }

    async updateUser() {
        await this.service.user.updateUser();
        this.ctx.body = 'hi, egg3';
    }

    async deleteUser() {
        await this.service.user.deleteUser();
        this.ctx.body = 'hi, egg3';
    };

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

