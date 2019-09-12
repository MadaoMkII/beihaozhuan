'use strict';
const moment = require('moment');
const Service = require('egg').Service;
require(`moment-timezone`);

class UserService extends Service {

    async syncingTasks(user) {
        let requireMissionResult = await this.ctx.service.missionProcessingTrackerService.requireMissionToTrack(user._id);
        requireMissionResult.find((missionArray) => {
            if ([`Weekly`, `Daily`, `Permanent`].includes(missionArray._id)) {
                missionArray.missions.forEach(async (mission) => {
                    let conditions = {
                        userID: user._id,
                        missionID: mission._id,
                        missionEventName: mission.title,
                        requireAmount: mission.requireAmount
                    };
                    let modelName = missionArray._id + `MissionProcessingTracker`;

                    switch (missionArray._id) {
                        case `Permanent`:
                            conditions.effectDay = `Permanent`;
                            break;
                        case `Daily`:
                            conditions.effectDay = this.ctx.app[`getFormatDate`](new Date());
                            break;
                        case `Weekly`:
                            conditions.effectDay = this.ctx.app[`getFormatWeek`](new Date());
                            break;
                    }
                    let missionTracker = await this.ctx.model[modelName].findOne(conditions);
                    if (this.ctx.helper.isEmpty(missionTracker)) {
                        let missionTracker = new this.ctx.model[modelName](conditions);
                        missionTracker.save();
                    }
                });
            }
        });
    };

    async updateUser(user_uuid, userObj) {
        delete userObj.uuid;
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

    async getReferrerID(inviteCode) {

        if (!this.ctx.helper.isEmpty(inviteCode)) {
            let userResult = await this.ctx.model.UserAccount.findOne({
                inviteCode: inviteCode
            });
            return userResult._id;
        }
    };

    async addUser(user, inviteCode) {
        user.referrer = await this.getReferrerID(inviteCode);
        if (!this.ctx.helper.isEmpty(user.referrer)) {
            let userResult = await this.ctx.model.UserAccount.findOne({
                _id: user.referrer
            });
        }
        const userNew = this.ctx.model.UserAccount(
            user
        );
        await userNew.save();
    };

    async getUser(user, project) {
        return this.ctx.model.UserAccount.findOne(user, project);
    };

    async getManyUser(conditions, option, project = {}) {
        if (!this.ctx.helper.isEmpty(conditions.nickName)) {
            conditions.nickName = {$regex: `.*${conditions.nickName}.*`};
        }
        let count = await this.ctx.model.UserAccount.countDocuments(conditions);
        let data = await this.ctx.model.UserAccount.find(conditions, project, option);
        return [data, count];
    };

    async getUserBalanceListRule(conditions, option) {
        let searcher = {};
        searcher.uuid = conditions.userUUid;
        let userObj = {
            "avatar": false,
            "gender": false,
            "birthday": false,
            "dailyMissionTrackers": false,
            "uuid": false,
            "role": false,
            "last_login_time": false,
            "loginTimes": false
        };

        userObj.balanceList = {$slice: [option.skip, option.limit]};
        return this.ctx.model.UserAccount.findOne(searcher, userObj);

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
    async setUserStatus(id, setObj, pushObj) {
        return this.ctx.model.UserAccount.findOneAndUpdate({_id: id},
            {$set: setObj, $push: pushObj}, {new: true});
    };

    async setUser(id, setObj, pushObj) {
        return this.ctx.model.UserAccount.findOneAndUpdate({_id: id},
            {$set: setObj, $push: pushObj}, {new: true});
    }
}

module.exports = UserService;