`use strict`;
const baseController = require(`../controller/baseController`);

class goodController extends baseController {
    async getManyGoods(ctx) {
        // let {unit, page, status, title} = ctx.request.body;
        // const validateResult = await ctx.validate('pageAndUnitRule', {unit, page, status, title});
        // if (!validateResult) return;
        // let condition = this.ctx.helper.cleanupRequest([`unit`, `page`], {unit, page, status, title});
        // const option = ctx.helper.operatorGenerator(page, unit);
        const [condition, option] = await this.cleanupRequestProperty('pageAndUnitRule',
            `unit`, `page`, `status`, `title`);
        if (!condition) {
            return;
        }
        let result = await ctx.service.goodService.getManyGood(condition, option);
        this.success(result);
    };

    async delGood(ctx) {
        let {uuid} = ctx.request.body;
        if (ctx.helper.isEmpty(uuid)) {
            ctx.throw(400, 'uuid can not be empty');
        }
        await ctx.service.goodService.delGood(uuid);
        this.success();
    };

    async createGood(ctx) {
        try {
            const [condition] = await this.cleanupRequestProperty('createGoodRule',
                `title`, `category`, `description`, `inventory`, `insuranceLink`, 'price');
            if (!condition) {
                return;
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
            newGood.uuid = `GD` + require('cuid')();
            newGood.category = condition.category;
            newGood.price = Number(condition.price);
            newGood.title = condition.title;
            newGood.insuranceLink = condition.insuranceLink;
            newGood.description = condition.description;
            newGood.inventory = Number(condition.inventory);
            let result = await ctx.service.goodService.createGood(newGood);
            this.success(result);
        } catch (e) {
            this.failure(e, 503)
        }

    };
}

module.exports = goodController;