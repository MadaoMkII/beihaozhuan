'use strict';
const Controller = require('./baseController');

class promotionController extends Controller {
  async approvePromotion(ctx) {
    try {
      const [ condition ] = await this.cleanupRequestProperty('promotionRules.approvePromotionRule',
        'uuid', 'decision');
      if (!condition) {
        return;
      }
      await ctx.service.userPromotionService.approvePromotion(condition);
      this.success();
    } catch (e) {
      console.log(e);
      this.failure(e);
    }
  }
  async getPromotionList(ctx) {
    try {
      const [ condition, option ] = await this.cleanupRequestProperty('promotionRules.getPromotionListRule',
        'title', 'promotionType', 'categoryUUid', 'page', 'unit');
      if (!condition) {
        return;
      }
      const data = await ctx.service.promotionService.getPromotionList(condition, option);
      const count = await this.getFindModelCount('Promotion', condition);
      this.success([ data, count ]);
    } catch (e) {
      console.log(e);
      this.failure(e);
    }
  }
  async createPromotion(ctx) {
    try {
      const [ condition ] = await this.cleanupRequestProperty('promotionRules.createPromotionRule',
        'title', 'categoryUUid', 'promotionType', 'platform', 'description',
        'reward', 'priority', 'mainlyShowPicUrl', 'link');
      if (!condition) {
        return;
      }
      await this.uploadAndSetPics(condition, 'showPics');
      condition.uuid = 'PRO' + require('cuid')();
      await ctx.service.promotionService.createPromotion(condition);
      this.success(condition.uuid);
    } catch (e) {
      console.log(e);
      this.failure(e);
    }
  }

  // OSS分组存储，然后删除的时候统一删除
  async addPromotionBranch(ctx) {
    try {
      const [ condition ] = await this.cleanupRequestProperty('promotionRules.setPromotionBranchRule',
        'promotionUUid', 'branchTitle', 'allowUpload', 'rewardSwitch',
        'promotionReward', 'description', 'downloadLink', 'showPics');
      if (!condition) {
        return;
      }
      // await this.uploadAndSetPics(condition, 'showPics');
      await ctx.service.promotionService.setPromotionBranch(condition);
      this.success();
    } catch (e) {
      this.failure(e);
    }
  }
  async updatePromotion(ctx) {
    try {
      const [ condition ] = await this.cleanupRequestProperty('promotionRules.updatePromotionBranchRule',
        'title', 'link', 'categoryUUid', 'promotionType', 'uuid',
        'platform', 'description', 'reward', 'priority', 'mainlyShowPicUrl');
      if (!condition) {
        return;
      }
      await ctx.service.promotionService.updatePromotion(condition);
      this.success();
    } catch (e) {
      this.failure(e);
    }
  }
  async updatePromotionBranch(ctx) {
    try {
      const [ condition ] = await this.cleanupRequestProperty('promotionRules.updatePromotionBranchRule',
        'branchTitle', 'allowUpload', 'uuid', 'showPics',
        'promotionReward', 'description', 'downloadLink', 'rewardSwitch');
      if (!condition) {
        return;
      }
      await this.uploadAndSetPics(condition, 'showPics');
      await ctx.service.promotionService.updatePromotionBranch(condition);
      this.success();
    } catch (e) {
      this.failure(e);
    }
  }
  async deletePromotionBranch(ctx) {
    try {
      const [ condition ] = await this.cleanupRequestProperty('uuidRule',
        'uuid');
      if (!condition) {
        return;
      }
      await ctx.service.promotionService.deletePromotionBranch(condition);
      this.success();
    } catch (e) {
      this.failure(e);
    }
  }
  // async getPromotionDetail(ctx) {
  //   const [ condition ] = await this.cleanupRequestProperty('uuidRule',
  //     'uuid');
  //   if (!condition) {
  //     return;
  //   }
  //   await ctx.service.promotionService.cleanPromotionBranch(condition);
  //   this.success();
  // } catch(e) {
  //   this.failure(e);
  // }
  //---------------------------------------------------------------------------
  async checkDownloadLink(ctx) {
    try {
      const [ condition ] = await this.cleanupRequestProperty('promotionRules.user.checkDownloadLinkRule',
        'promotionBranchUUid');
      if (!condition) {
        return;
      }
      condition.uuid = 'UPROB' + require('cuid')();
      await ctx.service.userPromotionService.checkDownloadLink(condition);
      this.success();
    } catch (e) {
      this.failure(e);
    }

  }
  async getPromotionDetail(ctx) {
    const [ condition ] = await this.cleanupRequestProperty('uuidRule',
      'uuid');
    if (!condition) {
      return;
    }
    const result = await ctx.service.userPromotionService.getDetail(condition);
    this.success(result);
  }

  async getMainPageData(ctx) {
    try {
      const [ condition ] = await this.cleanupRequestProperty('promotionRules.user.getMainPageDataRule',
        'platform');
      if (!condition) {
        return;
      }
      const result = await ctx.service.userPromotionService.getMainPageData(ctx.user, condition.platform);
      this.success(result);
    } catch (e) {
      console.log(e);
      this.failure(e);
    }
  }

  async submitUserPromotionService(ctx) {
    try {
      const [ condition ] = await this.cleanupRequestProperty('promotionRules.user.submitUserPromotionRule',
        'promotionBranchUUid');
      if (!condition) {
        return;
      }
      condition.uuid = 'UPRO' + require('cuid')();
      await ctx.service.userPromotionService.submitUserPromotion(condition);
      this.success();
    } catch (e) {
      console.log(e);
      this.failure(e);
    }
  }
}


module.exports = promotionController;
