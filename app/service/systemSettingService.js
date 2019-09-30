'use strict';
const Service = require('egg').Service;
require(`moment-timezone`);

class SystemSettingService extends Service {

    async setRecommendGood(uuid, status) {
        await this.ctx.model.Good.updateMany({ isRecommend:true },{$set:{isRecommend:false }});

        let good = await this.ctx.model.Good.findOneAndUpdate({uuid: uuid},
            {$set: {isRecommend: status}}, {new: true});

        if (!good) {
            this.ctx.throw(`good missing`)
        }
        if (status) {
            await this.setSetting({recommendGood: good._id});
        } else {
            await this.setSetting({recommendGood: `n/a`});
        }

    };

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

    setValue(oldObj, inputObj, checkedProperty) {
        if (this.ctx.helper.isEmpty(inputObj)) {
            return oldObj[checkedProperty];
        }
        return this.ctx.helper.isEmpty(inputObj[checkedProperty]) ? oldObj[checkedProperty] : inputObj[checkedProperty]
    };

    async setSetting(settingEntity) {
        let lastSettingObj = await this.getSetting();
        let settingObj = {};

        Object.keys(lastSettingObj[`_doc`]).forEach((key) => {
            settingObj[key] = this.setValue(lastSettingObj[`_doc`], settingEntity, key);
            if (typeof lastSettingObj[`_doc`][key] === `object` && (Object.keys(lastSettingObj[`_doc`][key]).length >= 2)) {
                Object.keys(lastSettingObj[`_doc`][key]).forEach((subKey) => {
                    if (![`_bsontype`, `id`].includes(subKey)) {
                        settingObj[key][subKey] = this.setValue(lastSettingObj[`_doc`][key], settingEntity[key], subKey);
                    }
                });
            }
        });
        Object.keys(settingEntity).forEach((key) => {
            if (!Object.keys(settingObj).includes(key)) {
                settingObj[key] = settingEntity[key];
            }
        });
        delete settingObj._id;
        delete settingObj.created_at;
        delete settingObj.updated_at;


        //settingObj.advertisementSetting = {square: fs.readFileSync(path.resolve(__dirname, '../public/admin.html'))};
        let systemSettingObj = new this.ctx.model.SystemSetting(
            settingObj
        );
        systemSettingObj.save();
    }
}

module.exports = SystemSettingService;