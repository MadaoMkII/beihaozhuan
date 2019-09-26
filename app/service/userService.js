'use strict';
const moment = require('moment');
const Service = require('egg').Service;
require(`moment-timezone`);

class UserService extends Service {

    async setUserBcionChange(user_uuid, category, income, amount) {
        let newBcionChange = {
            category: category,
            income: income,
            amount: amount,
            createTime: new Date(),
        };
        return this.ctx.model.UserAccount.findOneAndUpdate({uuid: user_uuid},
            {$push: {balanceList: newBcionChange}}, {new: true});

    };

    async syncingTasks(user) {
        let requireMissionResult = await this.ctx.service.missionProcessingTrackerService.requireMissionToTrack();
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
                        let newMissionTracker = new this.ctx.model[modelName](conditions);
                        newMissionTracker.save();
                    }
                });
            }
        });
        return requireMissionResult;
    };

    async updateUser(user_uuid, userObj) {
        delete userObj.uuid;
        return this.ctx.model.UserAccount.findOneAndUpdate({uuid: user_uuid}, {$set: userObj}, {new: true});
    };

    async updateUserPassword(tel_number, newPassword) {
        return this.ctx.model.UserAccount.findOneAndUpdate({tel_number: tel_number},
            {$set: {password: newPassword}}, {new: true});
    };

    async updateUser_login(user) {
        let absoluteDate = this.ctx.getAbsoluteDate();

        return this.ctx.model.UserAccount.findOneAndUpdate({uuid: user.uuid}, {
            $set: {last_login_time: absoluteDate},
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
        let userNew = this.ctx.model.UserAccount(user);
        if (!this.ctx.helper.isEmpty(inviteCode)) {
            userNew.referrer = await this.getReferrerID(inviteCode);
            if (!this.ctx.helper.isEmpty(user.referrer)) {
                let superiorUser = await this.ctx.model.UserAccount.findOneAndUpdate({
                    _id: user.referrer
                }, {$push: {referrals: userNew._id}});
            }
        }
        await userNew.save();
        return userNew;
    };

    async getUser(user, project) {
        return this.ctx.model.UserAccount.findOne(user, project);
    };

    async getMyTeam(user_uuid) {
        let result = await this.ctx.model.UserAccount.findOne({uuid: user_uuid}, {referrals: 1}).populate({
            path: `referrals`,
            model: this.ctx.model.UserAccount,
            select: 'nickName -_id created_at avatar',
        });
        return result["referrals"];
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