'use strict';
const baseController = require('../controller/baseController');

class homeCreditController extends baseController {

    async xab(ctx) {
        this.success();
    }

    async createPromotionProof(ctx) {
        try {
            const [condition] = await this.cleanupRequestProperty('homeCreditRules.createGoodRule',
                'tel_number');
            if (!condition) {
                return;
            }
            const doubleDec = {};
            const files = ctx.request.files;
            doubleDec.account = `1234`;
            // if (!ctx.helper.isEmpty(files)) {
            //     if (files.length < 3) {
            //         return this.failure(`图片数量不对`);
            //     }
            //     for (const fileObj of files) {
            //         doubleDec[fileObj.field] = await ctx.service.picService.putImgs(fileObj, doubleDec);
            //         // if (fileObj.field === 'mainlyShowPicUrl') {
            //         //     newGood.mainlyShowPicUrl = ossUrl;
            //         // } else {
            //         //     newGood.slideShowPicUrlArray.push(ossUrl);
            //         // }
            //
            //     }
            // } else {
            //     return this.failure(`图片数量不对`);
            // }
            doubleDec.tel_number_verify = condition.tel_number;
            let promise_1 = ctx.service.doubleDecService.createDoubleDec(doubleDec);
            this.success();
            Promise.all([promise_1]).then();
        } catch (e) {
            this.app.logger.error(e, ctx);
            this.failure();
        }
    }

}

module.exports = homeCreditController;