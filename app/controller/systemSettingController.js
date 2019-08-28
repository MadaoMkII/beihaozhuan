'use strict';

const Controller = require('./baseController');

class systemSettingController extends Controller {

    async setAdvPosition(ctx) {
        const [advertisement] = await this.cleanupRequestProperty('systemSettingRules.setAdvPositionRule',
            `location`, `adv_ID`, `title`, `length`, `activity`);
        if (!advertisement) {
            return;
        }
        let result = await ctx.service.systemSettingService.setAdvPosition(advertisement);
        this.success(result);
    }

}

module.exports = systemSettingController;