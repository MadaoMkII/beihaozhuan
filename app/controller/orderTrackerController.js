`use strict`;
const baseController = require(`../controller/baseController`);

class orderTrackerController extends baseController {
    async createOrder(ctx) {
        try {

            let {
                goodUUid, additionalInformation,
                realName, IDNumber, address, detailAddress, page, unit
            } = ctx.request.body;

            const validateResult = await ctx.validate('createInsuranceRule', {
                goodUUid,
                realName, IDNumber, address, detailAddress
            });
            if (!validateResult) return;
            let orderObj = this.ctx.helper.cleanupRequest([`unit`, `page`], {
                goodUUid, additionalInformation,
                realName, IDNumber, address, detailAddress
            });
            const option = ctx.helper.operatorGenerator(page, unit);
            let orderTracker = {
                customer_ID: ctx.user._id,
                goodUUid: orderObj.goodUUid,
                additionalInformation: orderObj.additionalInformation,
                realName: orderObj.realName,
                IDNumber: orderObj.IDNumber,
                address: orderObj.address,
                detailAddress: orderObj.detailAddress,
            };
            let result = await ctx.service.orderTrackerService.makeOrder(orderTracker, option);
            this.success(result);
        } catch (e) {
            this.failure(e.message, 400);
        }

    };

    async findOrder(ctx) {
        let {unit, page, orderUUid, title} = ctx.request.body;
        const validateResult = await ctx.validate('pageAndUnitRule', {unit, page});
        if (!validateResult) return;
        let objAfterClean = this.ctx.helper.cleanupRequest([`unit`, `page`], {unit, page, orderUUid, title});
        const option = ctx.helper.operatorGenerator(unit, page);
        let result = await this.ctx.service.orderTrackerService.findOrder(objAfterClean, option);
        this.success(result);
    }

}

module.exports = orderTrackerController;