'use strict';
const baseController = require('../controller/baseController');


class orderTrackerController extends baseController {
  // async getExcel(ctx) {
  //   try {
  //     const orderArray = await this.ctx.model.OrderTracker.find().populate({
  //       path: 'customer_ID',
  //       model: this.ctx.model.UserAccount,
  //       select: '-_id nickName tel_number',
  //     });
  //     const fileName = await ctx.service.excelService.createExcel(orderArray);
  //     // 请求返回，生成的xlsx文件
  //     ctx.status = 200;
  //     await ctx.downloader(fileName);
  //     fs.unlinkSync(fileName);
  //
  //   } catch (e) {
  //     this.app.logger.error(e, ctx);
  //     this.failure();
  //   }
  // }
  // async createOrder(ctx) {
  //   try {
  //     const [ requestEntity ] = await this.cleanupRequestProperty('orderTrackerRules.createInsuranceRule',
  //       'goodUUid', 'additionalInformation',
  //       'realName', 'IDNumber', 'address', 'detailAddress');
  //     if (!requestEntity) {
  //       return;
  //     }
  //     const orderTracker = {
  //       customer_ID: ctx.user._id,
  //       goodUUid: requestEntity.goodUUid,
  //       userUUid: ctx.user.uuid,
  //       additionalInformation: requestEntity.additionalInformation,
  //       realName: requestEntity.realName,
  //       IDNumber: requestEntity.IDNumber,
  //       address: requestEntity.address,
  //       detailAddress: requestEntity.detailAddress,
  //     };
  //
  //     const result = await ctx.service.orderTrackerService.makeOrder(orderTracker);
  //     this.success(result);
  //   } catch (e) {
  //     this.app.logger.error(e, ctx);
  //     this.failure();
  //   }
  // }
  // async findOrderByUser(ctx) {
  //   try {
  //     const [ condition, option ] = await this.cleanupRequestProperty('orderTrackerRules.findOrderOfUser', 'unit', 'page', 'userUUid');
  //     if (condition !== false) {
  //       const count = await this.getFindModelCount('OrderTracker', condition);
  //       const result = await this.ctx.service.orderTrackerService.findOrder(condition, option);
  //       this.success([ result, count ]);
  //     }
  //   } catch (e) {
  //     this.app.logger.error(e, ctx);
  //     this.failure();
  //   }
  // }
  // async getMyOrders(ctx) {
  //
  //   try {
  //     const [ condition, option ] = await this.cleanupRequestProperty('pageAndUnitRule',
  //       'unit', 'page');
  //     if (!condition) {
  //       return;
  //     }
  //     condition.customer_ID = ctx.user._id;
  //     const count = await this.getFindModelCount('OrderTracker', condition);
  //     const result = await ctx.service.orderTrackerService.findOrder(condition, option);
  //     return this.success([ result, count ]);
  //   } catch (e) {
  //     this.app.logger.error(e, ctx);
  //     this.failure();
  //   }
  // }
  // async findOrder(ctx) {
  //   try {
  //     const [ condition, option ] = await this.cleanupRequestProperty('orderTrackerRules.findGoodRule',
  //       'unit', 'page', 'orderUUid', 'title');
  //     if (!condition) {
  //       return;
  //     }
  //     const result = await this.ctx.service.orderTrackerService.findOrder(condition, option);
  //     const count = await this.getFindModelCount('OrderTracker', condition);
  //     this.success([ result, count ]);
  //   } catch (e) {
  //     this.app.logger.error(e, ctx);
  //     this.failure();
  //   }
  // }
  async makeOrder(ctx) {
    try {
      const [ condition ] = await this.cleanupRequestProperty('uuidRule',
        'uuid');
      if (!condition) {
        return;
      }
      await ctx.service.orderTrackerService.makeOrder(condition);
      this.success();
    } catch (e) {
      this.failure(e);
    }
  }


}
module.exports = orderTrackerController;
