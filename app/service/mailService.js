'use strict';
const {Service} = require('egg');
const nodeMailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');

class mailService extends Service {

    // async getSmtpConfig() {
    //     return {
    //         host: 'hwsmtp.exmail.qq.com',
    //         secure:
    //             true, // upgrade later with STARTTLS
    //         auth:
    //             {
    //                 user: this.app.config.mailusername,
    //                 pass: this.app.config.mailpassword
    //             }
    //     }
    // };


    async send(obj) {

        let config = this.app.config;
        let smtpTransport_done = nodeMailer.createTransport(smtpTransport({
            host: 'hwsmtp.exmail.qq.com', service: config.email.username,
            secure: true, // upgrade later with STARTTLS
            auth: {
                user: config.email.username,
                pass: config.email.password
            }
        }));
        let info = await smtpTransport_done.sendMail({
            from: config.email.user,
            to: obj.to,
            subject: obj.title,
            html: obj.html

        });

        smtpTransport_done.close();
    };


    sendValidate(obj) {
        obj.html = `<p><span id="9999" style="display: none !important; font-size:0; line-height:0"> </span></p><p>&nbsp;</p>
    <p>&nbsp;</p>
    <div style="width:100%; max-width:640px; margin:0 auto;">
        <div style="padding:0 25px; height:100px; background-color:#FF6C2C; color:#fff;">
            <div style=" display:inline-block; vertical-align:middle; padding-right:10px; margin-right:10px; border-right:1px solid #fff; float:left; margin-top:35px;"><img src="javascript:;" style="max-width:105px; max-height:24px;"></div>
            <span style="display:inline-block; height:24px; margin-top:35px; line-height:24px; float:left; font-size:16px;">开发如此简单</span></div>
        <div style="padding:35px 25px; font-size:16px;">
            <h4 style="font-size:16px; color:#4A4A4A; font-weight:normal; padding:0; margin:0; padding-bottom:20px; ">点击下面链接以完成验证</h4>
            <p style="padding:10px 35px; line-height:26px; word-break:break-all;"><a style="display:inline-block; padding:4px 15px; background-color:#FF6C2C; color:#fff; text-decoration:none; margin-bottom:15px;" href="${obj.href}" target="_blank">立即验证</a><br>
                <a href="${obj.href}" target="_blank">${obj.href} </a></p>
            <div style="text-align:right; font-size:14px; margin-top:50px;">Inmyjs工作室</div>
        </div>
        <div style="padding:0 25px; background-color:#F6F6F6; color:#979797; font-size:14px;">
            <p style="padding:20px 0; line-height:20px;">如果您并未发过此请求，可能是因为其他用户在验证邮箱时误输入了您的邮箱地址而使你收到了 这封邮件，请忽略此封邮件，无需进行任何操作。</p>
            <p style="padding:5px 0; line-height:24px">如有任何问题，请与我们联系，我们将尽快为你解答。<br>
                Email:<span style="color:#FF6C2C;"><a href="573391755@qq.com" target="_blank">573391755@qq.com</a></span>&nbsp;&nbsp; 电话：<span><span style="color:#FF6C2C; border-bottom:1px dashed #ccc;z-index:1" t="7" onclick="return false;" data=""></span></span></p>
        </div>
    </div>
    <br><br>`;
        this.send(obj);
    }

}

module.exports = mailService;