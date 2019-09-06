`use strict`;
const baseController = require(`../controller/baseController`);

class orderTrackerController extends baseController {
    async createOrder(ctx) {
        try {
            const [requestEntity] = await this.cleanupRequestProperty('orderTrackerRules.createInsuranceRule',
                `goodUUid`, `additionalInformation`,
                `realName`, `IDNumber`, `address`, `detailAddress`);
            if (!requestEntity) {
                return;
            }
            let orderTracker = {
                customer_ID: ctx.user._id,
                userUUid: ctx.user.uuid,
                goodUUid: requestEntity.goodUUid,
                additionalInformation: requestEntity.additionalInformation,
                realName: requestEntity.realName,
                IDNumber: requestEntity.IDNumber,
                address: requestEntity.address,
                detailAddress: requestEntity.detailAddress,
            };
            let result = await ctx.service.orderTrackerService.makeOrder(orderTracker);
            this.success(result);
        } catch (e) {
            this.failure(e.message, 400);
        }

    };

    async findOrderByUser() {
        const [condition, option] = await this.cleanupRequestProperty('orderTrackerRules.findOrderOfUser', `unit`, `page`, `userUUid`);
        if (condition !== false) {
            let result = await this.ctx.service.orderTrackerService.findOrder(condition, option);
            this.success(result);
        }
    };


    async findOrder() {
        const [condition, option] = await this.cleanupRequestProperty('orderTrackerRules.findGoodRule',
            `unit`, `page`, `orderUUid`, `title`);
        if (!condition) {
            return;
        }
        let result = await this.ctx.service.orderTrackerService.findOrder(condition, option);
        let count = await this.getFindModelCount(`OrderTracker`, condition);
        this.success([result, count]);
    }
}

module.exports = orderTrackerController;