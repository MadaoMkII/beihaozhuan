`use strict`;
const baseController = require(`../controller/baseController`);

class goodController extends baseController {
    async getManyGoods(ctx) {
        // let {unit, page, status, title} = ctx.request.body;
        // const validateResult = await ctx.validate('pageAndUnitRule', {unit, page, status, title});
        // if (!validateResult) return;
        // let condition = this.ctx.helper.cleanupRequest([`unit`, `page`], {unit, page, status, title});
        // const option = ctx.helper.operatorGenerator(page, unit);
        const [condition, option] = await this.cleanupRequestProperty('goodRules.findGoodRule',
            `unit`, `page`, `status`, `title`, `uuid`);
        if (!condition) {
            return;
        }
        let count = await this.getFindModelCount(`Good`, condition);
        let result = await ctx.service.goodService.getManyGood(condition, option);
        return this.success([result, count]);
    };

    async delGood(ctx) {
        let {uuid} = ctx.request.body;
        if (ctx.helper.isEmpty(uuid)) {
            this.failure(`uuid can not be empty`, 400)
        }
        await ctx.service.goodService.delGood(uuid);
        return this.success();
    };

    async setGoodStatus(ctx) {
        const [condition,] = await this.cleanupRequestProperty('goodRules.setGoodStatusRule',
            `uuid`, `status`);
        if (!condition) {
            return;
        }

        let result = await ctx.service.goodService.setGoodStatus(condition);
        if (ctx.helper.isEmpty(result)) {
            return this.failure(`找不到商品`, 400);
        }
        return this.success(result);

    };

    async generatorGood(ctx) {
        const [condition] = await this.cleanupRequestProperty('goodRules.createGoodRule',
            `title`, `category`, `description`, `inventory`, `insuranceLink`, 'price', 'paymentMethod');
        if (!condition) {
            return false;
        }
        let newGood = {};
        newGood.slideShowPicUrlArray = [];
        const files = ctx.request.files;
        if (!ctx.helper.isEmpty(files)) {
            for (let fileObj of files) {
                let ossUrl = await ctx.service.picService.putImgs(fileObj);
                if (fileObj.field === `mainlyShowPicUrl`) {
                    newGood.mainlyShowPicUrl = ossUrl;
                } else {
                    newGood.slideShowPicUrlArray.push(ossUrl);
                }
            }
        }
        newGood.category = condition.category;
        newGood.price = Number(condition.price) <= 0 ? 1 : Number(condition.price);
        newGood.title = condition.title;
        newGood.insuranceLink = condition.insuranceLink;
        newGood.description = condition.description;
        newGood.inventory = Number(condition.inventory) <= 0 ? 1 : Number(condition.inventory);
        newGood.paymentMethod = condition.paymentMethod;
        return newGood;
    };

    async updateGood(ctx) {
        try {
            const {uuid} = ctx.request.body;
            let newGood = await this.generatorGood(ctx);
            if (newGood === false) {
                return;
            }
            let result = await ctx.service.goodService.updateGood(newGood, uuid);
            if (ctx.helper.isEmpty(result)) {
                return this.failure(`通过UUID找不到商品`, 400);
            }
            return this.success();
        } catch (e) {
            this.failure(e.message, 503)
        }
    };

    async createGood(ctx) {
        try {
            let uuid = `GD` + require('cuid')();
            let newGood = await this.generatorGood(ctx);
            if (newGood === false) {
                return;
            }
            newGood.uuid = uuid;
            let result = await ctx.service.goodService.createGood(newGood);
            return this.success(result);
        } catch (e) {
            this.failure(e.message, 503)
        }
    };
}

module.exports = goodController;