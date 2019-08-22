'use strict';
const moment = require('moment');
const Service = require('egg').Service;
require(`moment-timezone`);

class UserService extends Service {
    // async tryUser(user) {
    //     let uuid = require('cuid')();
    //     const userNew = this.ctx.model.UserAccount(
    //         {username: uuid + 'a', password: uuid + `b`, uuid: uuid, tel_number: uuid + 'f', Bcoins: 123}
    //     );
    //     return userNew;
    // };
    async initialLoginUser(user) {
        // if(user.dailyMissionTrackers!==[]){
        //     this.ctx.model.mission.findOne();
        // }
        let missionsArray = await this.ctx.model.Mission.find();
        let missionBox = [];
        for (const mission of missionsArray) {
            let MissionProcessingTracker = await this.ctx.model.MissionProcessingTracker.findOneAndUpdate({
                effectDay: this.ctx.app.getFormatDate(),
                userID: user._id,
                missionID: mission._id,
                missionEventName: mission.eventName,
            }, {}, {upsert: true, new: true});
            missionBox.push(MissionProcessingTracker._id)
        }
        return this.ctx.model.UserAccount.findOneAndUpdate({_id: user._id},
            {$set: {dailyMissionTrackers: missionBox}}, {new: true}).populate('dailyMissionTrackers');
    };

    async updateUser(user_uuid, userObj) {
        return this.ctx.model.UserAccount.findOneAndUpdate({uuid: user_uuid}, {$set: userObj}, {new: true});
    };

    async updateUserPassword(tel_number, newPassword) {
        return this.ctx.model.UserAccount.findOneAndUpdate({tel_number: tel_number},
            {$set: {password: newPassword}}, {new: true});
    };

    async updateUser_login(user_uuid) {
        return this.ctx.model.UserAccount.findOneAndUpdate({uuid: user_uuid}, {
            $set: {last_login_time: moment()},
            $inc: {loginTimes: 1}
        }, {new: true});
    };

    async addUser(user) {
        const userNew = this.ctx.model.UserAccount(
            user
        );
        await userNew.save();
    };

    async getUser(user) {
        return this.ctx.model.UserAccount.findOne(user);
    };

    async getManyUser(conditions, option) {
        return this.ctx.model.UserAccount.find(conditions, {}, option);
    };

    async changeBcoin(_id, newBasin_unencrypted, balanceRecord) {
        await this.setUser(_id, {Bcoins: newBasin_unencrypted}, {balanceList: balanceRecord});
    };

//{$set: {Bcoins: newBasin_unencrypted}, $push: {missionTrackers: missionEvent}}, {new: true});
//     async changeUserMoney(_id, newBasin_unencrypted, missionEvent) {
//         if (!missionEvent) {
//             this.ctx.throw(400, `missionEvent missing!`);
//         }
//         this.setUser(_id, {Bcoins: newBasin_unencrypted}, {missionTrackers: missionEvent})
//     }

    async setUser(id, setObj, pushObj) {
        return this.ctx.model.UserAccount.findOneAndUpdate({_id: id},
            {$set: setObj, $push: pushObj}, {new: true});
    }
}

module.exports = UserService;