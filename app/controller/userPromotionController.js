'use strict';
const Controller = require('./baseController');
class UserPromotionController extends Controller {

  async submitUserPromotionService(ctx) {
    try {
      const [ condition ] = await this.cleanupRequestProperty('promotionRules.user.submitUserPromotionRule',
        'promotionBranchUUid', 'screenshotUrls');
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

  //--------------------------


}
module.exports = UserPromotionController;
