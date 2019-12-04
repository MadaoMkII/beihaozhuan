'use strict';
const baseController = require('../controller/baseController');

class homeCreditController extends baseController {

  async verifyProofs(ctx) {
    try {
      const [ condition ] = await this.cleanupRequestProperty('homeCreditRules.verifyProofRule',
        'id', 'status');
      if (!condition) {
        return;
      }
      const status = condition.status;
      const doubleDec = await ctx.model.DoubleDec.findOneAndUpdate({ _id: condition.id }, { $set: { status } });
      if (!doubleDec) {
        return this.failure('找不到该明目');
      }
      const newBcoin = Number(ctx.user.Bcoins) + 5000;
      const promise_2 = this.ctx.service.userService.setUserBcionChange(doubleDec.userUUid, '活动奖励-双十二',
        '获得', 5000, newBcoin);
      this.success();
      Promise.all([ promise_2 ]).catch(error => {
        ctx.throw(500, error);
      });
    } catch (e) {
      this.app.logger.error(e, ctx);
      this.failure();
    }
  }


  async checkProofsStatus(ctx) {
    try {
      const result = await ctx.model.DoubleDec.findOne({ userUUid: ctx.user.uuid });
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
      const [ condition, option ] = await this.cleanupRequestProperty('goodRules.findGoodRule',
        'unit', 'page', 'status', 'tel_number');
      if (!condition) {
        return;
      }
      if (!ctx.helper.isEmpty(condition.tel_number)) {
        condition.title = { $regex: `.*${condition.tel_number}.*` };
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

      const result = await ctx.model.DoubleDec.findOne({ userUUid: ctx.user.uuid });
      if (!ctx.helper.isEmpty(result)) {
        return this.success({ status: result.status });
      }
      const doubleDec = {};
      const files = ctx.request.files;
      const user = ctx.user;
      doubleDec.account = condition.account;
      doubleDec.tel_number_verify = user.tel_number;
      doubleDec.userUUid = user.uuid;
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
      const promise_1 = ctx.service.doubleDecService.createDoubleDec(doubleDec.tel_number_verify, doubleDec);
      this.success();
      Promise.all([ promise_1 ]).then();
    } catch (e) {
      this.app.logger.error(e, ctx);
      this.failure();
    }
  }

}

module.exports = homeCreditController;
