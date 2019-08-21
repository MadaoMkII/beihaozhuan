`use strict`;
const baseController = require(`../controller/baseController`);

class goodController extends baseController {
    async getManyGoods(ctx) {
        let {unit, page, status, title} = ctx.request.body;
        const validateResult = await ctx.validate('pageAndUnitRule', {unit, page, status, title});
        if (!validateResult) return;
        let condition = this.ctx.helper.cleanupRequest([`unit`, `page`], {unit, page, status, title});
        const option = this.pageModel(page, unit);

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

    async creatGood(ctx) {

        let {title, category, price, description, inventory, insuranceLink} = ctx.request.body;
        price = Number(price);
        inventory = Number(inventory);
        const validateResult = await ctx.validate('createGoodRule', {
            title,
            category,
            price,
            description,
            inventory,
            insuranceLink
        });
        if (!validateResult) return;

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
        newGood.category = category;
        newGood.price = price;
        newGood.title = title;
        newGood.insuranceLink = insuranceLink;
        newGood.description = description;
        newGood.inventory = inventory;
        let result = await ctx.service.goodService.createGood(newGood);
        this.success(result);
    };
}

module.exports = goodController;