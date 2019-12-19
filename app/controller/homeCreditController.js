'use strict';
const baseController = require('../controller/baseController');

class homeCreditController extends baseController {

  async getDoubleDecInviteLink(ctx) {
    const inviteCode = ctx.user.inviteCode;
    const jsonObj = encodeURIComponent(JSON.stringify({ inviteCode, stateMessage: 'gift', sourceFrom: 'doubleDec' }));
    const link = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx87462aaa978561bf&redirect_uri=https%3a%2f%2fwww.beihaozhuan.com/wechat/callback&response_type=code&scope=snsapi_userinfo&state=${jsonObj}`;
    this.success(link);
  }

  async setDownload(ctx) {
    try {
      const doubleDec = {};
      doubleDec.tel_number_verify = ctx.user.tel_number;
      doubleDec.hasDownload = true;
      await ctx.service.doubleDecService.createDoubleDec(doubleDec.tel_number_verify, doubleDec);
      this.success();
    } catch (e) {
      this.app.logger.error(e, ctx);
      this.failure();
    }
  }

  async verifyProofs(ctx) {
    try {
      const [ condition ] = await this.cleanupRequestProperty('homeCreditRules.verifyProofRule',
        'id', 'status');
      if (!condition) {
        return;
      }
      const status = condition.status;
      const doubleDec = await ctx.model.DoubleDec.findOne({ _id: condition.id, hasDownload: true });
      if (!doubleDec) {
        return this.success('找不到该明目或者用户没有下载，无法通过执行');
      }
      if (doubleDec.status === '审核通过') {
        return this.success('已经进行过审核无法再次执行');
      }
      if (status === '审核通过') {
        const user = await ctx.model.UserAccount.findOne({ uuid: doubleDec.userUUid });
        const newBcoin = Number(user.Bcoins) + 5000;
        await ctx.service.analyzeService.dataIncrementRecord('活动奖励-双十二', 5000, 'bcoin', '活动');
        await this.ctx.service.userService.setUserBcionChange(doubleDec.userUUid, '活动奖励-双十二',
          '获得', 5000, newBcoin);
        await ctx.model.DoubleDec.update({ _id: condition.id, hasDownload: true }, { $set: { status } });
        await this.ctx.app.eventEmitter.emit('normalMissionCount', user.referrer, '活动—双十二邀请好友得现金');
      }
      this.success();
    } catch (e) {
      this.app.logger.error(e, ctx);
      this.failure();
    }
  }


  async checkProofsStatus(ctx) {
    try {
      const result = await ctx.model.DoubleDec.findOne({ userUUid: ctx.user.uuid, loginPicUrl: { $ne: null } }, {}, { sort: { created_at: -1 } });
      if (!ctx.helper.isEmpty(result)) {
        return this.success({ status: result.status });
      }
      this.success({ status: '无订单' });
    } catch (e) {
      this.app.logger.error(e, ctx);
      this.failure();
    }
  }

  async getProofs(ctx) {
    try {
      const [ condition, option ] = await this.cleanupRequestProperty('homeCreditRules.findGoodRule',
        'unit', 'page', 'status', 'account');
      if (!condition) {
        return;
      }
      if (!ctx.helper.isEmpty(condition.account)) {
        condition.account = { $regex: `.*${condition.account}.*` };
      }
      const count = await this.getFindModelCount('DoubleDec', condition);
      const result = await ctx.service.doubleDecService.getManyDoubleDec(condition, option);
      return this.success([ result, count ]);
    } catch (e) {
      this.app.logger.error(e, ctx);
      this.failure();
    }
  }

  async createPromotionProof(ctx) {
    try {
      const [ condition ] = await this.cleanupRequestProperty('homeCreditRules.createGoodRule',
        'account');
      if (!condition) {
        return;
      }
      const result = await ctx.model.DoubleDec.findOne({ userUUid: ctx.user.uuid, status: '审核通过' });
      if (!ctx.helper.isEmpty(result)) {
        return this.success({ status: result.status });
      }
      const doubleDec = {};
      const files = ctx.request.files;
      const user = ctx.user;
      doubleDec.account = condition.account;
      doubleDec.tel_number_verify = user.tel_number;
      doubleDec.userUUid = user.uuid;
      doubleDec.status = '未审核';
      if (!ctx.helper.isEmpty(files)) {
        if (files.length < 3) {
          return this.failure('图片数量不对');
        }
        for (const fileObj of files) {
          doubleDec[fileObj.field] = await ctx.service.picService.putImgs(fileObj, 'doubleDec');
        }
      } else {
        return this.failure('图片数量不对');
      }
      await ctx.service.doubleDecService.createDoubleDec(doubleDec.tel_number_verify, doubleDec);
      this.success();

    } catch (e) {
      this.app.logger.error(e, ctx);
      this.failure();
    }
  }

}

module.exports = homeCreditController;
