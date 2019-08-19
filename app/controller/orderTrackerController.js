`use strict`;
const baseController = require(`../controller/baseController`);

class orderTrackerController extends baseController {
    async createOrder(ctx) {
        try {

            let {
                goodUUid, additionalInformation,
                realName, IDNumber, address, detailAddress
            } = ctx.request.body;

            const validateResult = await ctx.validate('createInsuranceRule', {IDNumber});
            if (!validateResult) return;

            let orderTracker = {
                customer_ID: ctx.user._id,
                goodUUid: goodUUid,
                additionalInformation: additionalInformation,
                realName: realName,
                IDNumber: IDNumber,
                address: address,
                detailAddress: detailAddress,
            };
            let result = await ctx.service.orderTracker.makeOrder(orderTracker);
            this.success(result);
        } catch (e) {
            this.failure(e.message, 400);
        }

    };
}

module.exports = orderTrackerController;