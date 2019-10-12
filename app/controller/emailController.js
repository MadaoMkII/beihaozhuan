'use strict';

const Controller = require('./baseController');

class emailController extends Controller {

  async sendEmail(ctx) {
    await ctx.service.mailService.sendValidate({
      to: '595369018@qq.com',
      title: 'ceshi',
      href: 'http://www.google.com',
    });
    this.success();
  }
}

module.exports = emailController;
