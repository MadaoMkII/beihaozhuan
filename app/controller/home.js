'use strict';

const Controller = require('./baseController');

class HomeController extends Controller {


    async test(ctx) {


        await ctx.service[`userService`].setUserBcionChange(ctx.user.uuid, `测试活动奖励`, `获得`, 4500);
        // let userResult = await ctx.model[`UserAccountFake`].find({
        //     // lottery: {$exists: 1},
        //     // signTimes: {$exists: 1}
        // }, {}, {limit: 400});
        //
        // for (const userOld of userResult) {
        //
        //     let uuid = require('cuid')();
        //     const enPassword = ctx.helper.passwordEncrypt(userOld.password);
        //
        //     let signTimes = userOld.signTimes;
        //     let signTimesBcoin = 0;
        //     if (!ctx.helper.isEmpty(signTimes)) {
        //         switch (true) {
        //             case (signTimes >= 5):
        //                 signTimesBcoin = 30000;
        //                 break;
        //             case (signTimes >= 3):
        //                 signTimesBcoin = 10000;
        //                 break;
        //             case (signTimes >= 1):
        //                 signTimesBcoin = 1000;
        //                 break;
        //             default:
        //                 signTimesBcoin = 0;
        //                 break;
        //         }
        //     }
        //
        //     let lotteryBcoin = 0;
        //     let lottery = userOld.lottery;
        //     if (!ctx.helper.isEmpty(lottery)) {
        //         switch (lottery) {
        //             case lottery = 2:
        //                 lotteryBcoin = 20000;
        //                 break;
        //             case lottery = 1:
        //                 lotteryBcoin = 10000;
        //                 break;
        //             default:
        //                 lotteryBcoin = 0;
        //                 break;
        //         }
        //     }
        //
        //
        //     console.log({signTimes: signTimes, signTimesBcoin: signTimesBcoin});
        //     console.log({lottery: lottery, lotteryBcoin: lotteryBcoin});
        //
        //     let finallyBcoin = lotteryBcoin + signTimesBcoin + 50000;
        //     console.log(finallyBcoin);
        //     console.log(`-------------------------------`);
        //     let newUser = {
        //         password: enPassword,
        //         uuid: uuid,
        //         role: '用户',
        //         tel_number: userOld.tel_number,
        //         Bcoins: finallyBcoin,
        //
        //     };
        //     await ctx.service[`userService`].addUser(newUser, null);
        //
        //     await ctx.service[`userService`].setUserBcionChange(uuid, `预热活动奖励`,
        //         `获得`, finallyBcoin);
       // }
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

