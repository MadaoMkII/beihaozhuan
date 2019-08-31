'use strict';
const Controller = require('./baseController');

class systemSettingController extends Controller {
    async setBannerGood(ctx) {
        const {uuid} = ctx.request.body;
        if (ctx.helper.isEmpty(uuid)) {
            ctx.throw(400, ``);
        }
        await ctx.service.systemSettingService.setBannerGood(uuid);
        this.success();
    };

    async setAdvPosition(ctx) {
        const [advertisement] = await this.cleanupRequestProperty('systemSettingRules.setAdvPositionRule',
            `location`, `adv_ID`, `title`, `length`, `activity`, `weight`);
        if (!advertisement) {
            return;
        }
        let result = await ctx.service.systemSettingService.setAdvPosition(advertisement);
        this.success(result);
    };

    async getAdvPosition(ctx) {
        let {location} = ctx.request.body;
        let result;
        if (ctx.helper.isEmpty(location)) {
            result = await ctx.service.systemSettingService.findAdvPosition({});
        } else {
            result = await ctx.service.systemSettingService.findAdvPosition({"advPosition.location": location});
        }

        let positionInfo = [];
        positionInfo.push(result.advPosition.find((element) => {
            element.advPosition.location = location;
        }));
        this.success(result);
    }

}

module.exports = systemSettingController;