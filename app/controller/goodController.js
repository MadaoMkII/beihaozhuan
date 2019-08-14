`use strict`;
const baseController = require(`../controller/baseController`);

class goodController extends baseController {
    async getAll(ctx) {
        let result = await ctx.service.goodService.getAll();
        this.success(result);
    };

    async creatGood(ctx) {
        let newGood = {};

        const {category, price, description, inventory} = ctx.request.body;
        const validateResult = await ctx.validate('loginRule', {price, inventory});
        if (!validateResult) return;

        const files = ctx.request.files;
        console.log(files)
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

        newGood.uuid = require('cuid')();
        newGood.category = category;
        newGood.price = price;
        newGood.description = description;
        newGood.inventory = inventory;
        let result = await ctx.service.goodService.createGood(newGood);
        this.success(result);
    };
}

module.exports = goodController;