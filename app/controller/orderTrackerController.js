`use strict`;
const baseController = require(`../controller/baseController`);
const fs = require('fs');

class orderTrackerController extends baseController {

    async getExcel(ctx) {
        let orderArray = await this.ctx.model[`OrderTracker`].find().populate({
            path: "customer_ID",
            model: this.ctx.model[`UserAccount`],
            select: "-_id nickName tel_number"
        });
        let fileName = await ctx.service[`excelService`].createExcel(orderArray);
        //请求返回，生成的xlsx文件
        ctx.status = 200;
        await ctx.downloader(fileName);
        fs.unlinkSync(fileName);

    };

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
                goodUUid: requestEntity.goodUUid,
                userUUid: ctx.user.uuid,
                additionalInformation: requestEntity.additionalInformation,
                realName: requestEntity.realName,
                IDNumber: requestEntity.IDNumber,
                address: requestEntity.address,
                detailAddress: requestEntity.detailAddress,
            };
            console.log(orderTracker)
            let result = await ctx.service[`orderTrackerService`].makeOrder(orderTracker);
            this.success(result);
        } catch (e) {
            this.failure(e.message, 400);
        }

    };

    async findOrderByUser() {
        const [condition, option] = await this.cleanupRequestProperty('orderTrackerRules.findOrderOfUser', `unit`, `page`, `userUUid`);
        if (condition !== false) {

            let count = await this.getFindModelCount(`OrderTracker`, condition);
            let result = await this.ctx.service[`orderTrackerService`].findOrder(condition, option);
            this.success([result,count]);
        }
    };

    async getMyOrders(ctx) {
        const [condition, option] = await this.cleanupRequestProperty('pageAndUnitRule',
            `unit`, `page`);
        if (!condition) {
            return;
        }
        condition.customer_ID = ctx.user._id;
        let count = await this.getFindModelCount(`OrderTracker`, condition);
        let result = await ctx.service[`orderTrackerService`].findOrder(condition, option);
        return this.success([result, count]);
    };


    async findOrder() {
        const [condition, option] = await this.cleanupRequestProperty('orderTrackerRules.findGoodRule',
            `unit`, `page`, `orderUUid`, `title`);
        if (!condition) {
            return;
        }
        let result = await this.ctx.service[`orderTrackerService`].findOrder(condition, option);
        let count = await this.getFindModelCount(`OrderTracker`, condition);
        this.success([result, count]);
    }

}

module.exports = orderTrackerController;