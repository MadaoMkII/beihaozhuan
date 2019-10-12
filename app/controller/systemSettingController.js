'use strict';
const baseController = require('../controller/baseController');
const fs = require('fs');
const path = require('path');

class SystemSettingController extends baseController {

  async setRecommendGood(ctx) {
    const { uuid, status } = ctx.request.body;
    if (ctx.helper.isEmpty(uuid) || ctx.helper.isEmpty(status)) {
      return this.failure('uuid status不能为空', 400);
    }
    await ctx.service.systemSettingService.setRecommendGood(uuid, status);
    this.success();
  }


  async setSetting(ctx) {
    const newUser = await ctx.service.systemSettingService.setSetting(ctx.request.body);
    this.success(newUser);
  }

  async getSquare(ctx) {
    await ctx.service.systemSettingService.getSetting();
    ctx.response.type = 'html';
    ctx.body = fs.readFileSync(path.resolve(__dirname, '../public/square.html'));
  }

  async getSetting(ctx) {
    const result = await ctx.service.systemSettingService.getSetting();
    this.success(result);
  }

  async getMemberNumber() {
    const count = await this.getFindModelCount('UserAccount');
    const result = await this.ctx.service.systemSettingService.getSetting();
    this.success({ count: count + result.weighting });
  }
}

module.exports = SystemSettingController;
