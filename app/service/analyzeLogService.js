'use strict';
const BaseService = require('./baseService');
class analyzeLogService extends BaseService {

  async recordDownloadChange(condition) {
    const today = this.getBeginOfDay();
    await this.ctx.model.AnalyzeLog.updateOne({
      analyzeDate: today,
      type: 'download_daily',
      category: condition.name,
      category_2: condition.gameUUid,
      category_3: 'downloadCount',
    },
    {
      $addToSet: {
        dataArray: condition.tel_number,
      },
      $inc: { totalAmount: 1 } }, { upsert: true });
  }


  async recordApproveChange(gameObj, userObj) {
    const today = this.getBeginOfDay();
    await this.ctx.model.AnalyzeLog.updateOne({
      analyzeDate: today,
      type: 'download',
      category: gameObj.name,
      category_2: gameObj.uuid,
      category_3: gameObj.type,
    },
    {
      $addToSet: {
        dataArray: {
          nickName: userObj.nickName,
          tel_number: userObj.tel_number,
        },
      }, $inc: { amount: 1 } }, { upsert: true });
  }

  /**
   *
   * @param  user 用户对象
   * @param {Number} amount 金额数目
   * @param {String} category 收入/消费/贡献
   * @param {String} category_2 二级分类 自我收入/返利、给利 等
   * @return {void}
   */
  async recordPersonalBcoinChange(user, amount, category, category_2 = '自我收入') {
    const today = this.getBeginOfDay();
    let totalAmount = 0;

    const lastAnalyzeLog = await this.ctx.model.AnalyzeLog.findOne({
      analyzeDate: today,
      tel_number: user.tel_number,
      type: 'Bcoin',
      category,
      category_2,
    }, {}, { sort: { created_at: -1 } });

    if (!this.isEmpty(lastAnalyzeLog) && !this.isEmpty(lastAnalyzeLog.totalAmount)) {
      totalAmount = lastAnalyzeLog.totalAmount;
    }
    totalAmount += amount;
    await this.ctx.model.AnalyzeLog.updateOne({
      analyzeDate: today,
      tel_number: user.tel_number,
      type: 'Bcoin',
      category,
      category_2,
    }, { $set: {
      tel_number: user.tel_number,
      nickName: user.nickName,
      date_1: user.created_at,
      totalAmount,
    }, $inc: { amount } }, { upsert: true });
  }
}

module.exports = analyzeLogService;
