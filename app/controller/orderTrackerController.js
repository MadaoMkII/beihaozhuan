`use strict`;
const baseController = require(`../controller/baseController`);

class orderTrackerController extends baseController {
    async createOrder(ctx) {
        try {

            let {
                goodUUid, additionalInformation, goodCategory, goodPrice,
                realName, IDNumber, address, detailAddress
            } = ctx.request.body;

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