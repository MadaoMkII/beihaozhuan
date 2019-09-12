`use strict`;
const baseController = require(`../controller/baseController`);

class SystemSettingController extends baseController {

    async setSetting(ctx) {
        let newUser = await ctx.service.systemSettingService.setSetting(ctx.request.body);
        this.success(newUser);
    };

    async getSetting(ctx) {
        let result = await this.ctx.service.systemSettingService.getSetting();
        this.success(result);
    };
    async getMemberNumber(ctx) {

        this.success({count:1024});
    };
}

module.exports = SystemSettingController;