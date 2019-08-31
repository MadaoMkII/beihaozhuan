'use strict';
const {Service} = require('egg');

class systemSettingService extends Service {
    async findAdvPosition(location) {

        return this.ctx.model.SystemSetting.findOne(location,
            {"advPosition.$._id": false});
    };

    async setBannerGood(uuid) {
        let good = await this.ctx.service.goodService.getGood(uuid);
        if (good === null) {
            this.ctx.throw(400, `Good doesn't exist`)
        }
        return this.ctx.model.SystemSetting.findOneAndUpdate({},
            {$set: {"goodSetting.bannerGood": good._id}}, {new: true, upsert: true});
    };

    async setAdvPosition(setting) {

        // return  this.ctx.model.SystemSetting.create({
        //      advPosition: [{
        //          location: `未分类`,
        //          advPositionInfo: {
        //              adv_ID: setting.adv_ID,
        //              title: setting.title,
        //              length: setting.length,
        //              weight: setting.weight,
        //              activity: false
        //          }
        //      }]
        //  });

        return this.ctx.model.SystemSetting.findOneAndUpdate({"advPosition.location": setting.location}, {
            $set: {
                "advPosition.$.advPositionInfo.title": setting.title,
                "advPosition.$.advPositionInfo.adv_ID": setting.adv_ID,
                "advPosition.$.advPositionInfo.length": setting.length,
                "advPosition.$.advPositionInfo.weight": setting.weight,
                "advPosition.$.advPositionInfo.activity": setting.activity
            }
        }, {new: true, upsert: true});
    };
}

module.exports = systemSettingService;