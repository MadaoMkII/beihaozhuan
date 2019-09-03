'use strict';
const moment = require('moment');
const Service = require('egg').Service;
require(`moment-timezone`);

class SystemSettingService extends Service {

    async getSetting() {
        // let setting = new this.ctx.model.SystemSetting({
        //     registerMission: {activity: false, reward: 11},
        //     inviteMission: {numberOfInvite: 112, activity: false, reward: 1036},
        //     weighting: 2,
        //     serviceNumber: `xs`
        // });
        //await setting.save();
        return this.ctx.model.SystemSetting.findOne({}, {}, {sort: {updated_at: -1}});
    };

    async setValue(oldObj, inputObj, checkedProperty) {
        if (this.ctx.helper.isEmpty(inputObj)) {
            return oldObj[checkedProperty];
        }
        return this.ctx.helper.isEmpty(inputObj[checkedProperty]) ? oldObj[checkedProperty] : inputObj[checkedProperty]
    };

    async setSetting(settingEntity) {
        let lastSettingObj = await this.getSetting();
        let registerMission = {
            activity: await this.setValue(lastSettingObj.registerMission, settingEntity.registerMission, `activity`),
            reward: await this.setValue(lastSettingObj.registerMission, settingEntity.registerMission, `reward`)
        };
        let inviteMission = {
            numberOfInvite: await this.setValue(lastSettingObj.inviteMission, settingEntity.inviteMission, `numberOfInvite`),
            activity: await this.setValue(lastSettingObj.inviteMission, settingEntity.inviteMission, `activity`),
            reward: await this.setValue(lastSettingObj.inviteMission, settingEntity.inviteMission, `reward`)
        };
        let weighting = await this.setValue(lastSettingObj, settingEntity, `weighting`);
        let serviceNumber = await this.setValue(lastSettingObj, settingEntity, `serviceNumber`);

        let systemSettingObj = new this.ctx.model.SystemSetting({
            registerMission: registerMission,
            inviteMission: inviteMission,
            weighting: weighting,
            serviceNumber: serviceNumber
        });

        systemSettingObj.save();


        // return this.ctx.model.Mission.findOneAndUpdate({
        //     missionType: "Permanent",
        //     title: ""
        // }, {
        //     $set: {
        //         registerMission: registerMission,
        //         inviteMission: inviteMission,
        //         weighting: weighting,
        //         serviceNumber: serviceNumber
        //     }
        // }, {sort: {updated_at: -1}, new: true});

    }
}

module.exports = SystemSettingService;