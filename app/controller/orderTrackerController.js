`use strict`;
const baseController = require(`../controller/baseController`);

class orderTrackerController extends baseController {
    async createOrder(ctx) {
        try {

            const [requestEntity] = await this.cleanupRequestProperty('createInsuranceRule',
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

        const [condition, option] = await this.cleanupRequestProperty('findOrderOfUser', `unit`, `page`, `userUUid`);
        if (condition !== false) {
            let result = await this.ctx.service.orderTrackerService.findOrder(condition, option);
            this.success(result);
        }
    };


    async findOrder() {
        // let {unit, page, orderUUid, title} = ctx.request.body;
        // const validateResult = await ctx.validate('pageAndUnitRule', {unit, page});
        // if (!validateResult) return;
        // let objAfterClean = this.ctx.helper.cleanupRequest([`unit`, `page`], {unit, page, orderUUid, title});
        // const option = ctx.helper.operatorGenerator(unit, page);
        const cleanupResult = await this.cleanupRequestProperty('pageAndUnitRule',
            `unit`, `page`, `orderUUid`, `title`);
        if (cleanupResult !== false) {
            let condition = cleanupResult[0];
            let option = cleanupResult[1];
            let result = await this.ctx.service.orderTrackerService.findOrder(condition, option);
            this.success(result);
        }
    }
}

module.exports = orderTrackerController;