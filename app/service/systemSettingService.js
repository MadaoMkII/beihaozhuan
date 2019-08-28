'use strict';
const {Service} = require('egg');

class systemSettingService extends Service {
    async setAdvPosition(setting) {
        return this.ctx.model.SystemSetting.findOneAndUpdate({"advPosition.location": setting.location}, {
            $set: {"advPosition.$.advPositionInfo": setting}
        }, {new: true});
    };
}

module.exports = systemSettingService;