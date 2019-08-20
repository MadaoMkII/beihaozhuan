`use strict`;
const baseController = require(`../controller/baseController`);

class goodController extends baseController {
    async getAll(ctx) {
        let result = await ctx.service.goodService.getAll();
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