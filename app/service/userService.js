'use strict';
const Service = require('egg').Service;
require(`moment-timezone`);

class UserService extends Service {

    async setUserBcionChange(user_uuid, category, income, amount) {
        let newBcionChange = {
            category: category,
            income: income,
            amount: amount,
            createTime: new Date(), //必须加入那些代码
        };
        return this.ctx.model[`UserAccount`].findOneAndUpdate({uuid: user_uuid},
            {$push: {balanceList: newBcionChange}}, {new: true});

    };


    async syncingTasks(user) { //把mission同步为missionTracker

        let promiseArray = [];
        let closedMissionArray = await this.ctx.service[`missionProcessingTrackerService`].requireMissionToTrack("disable");

        for (const missionElement of closedMissionArray) {
            let modelName = missionElement._id + `MissionProcessingTracker`;
            missionElement.missions.forEach((littleMission) => {
                let promise = this.ctx.model[modelName].deleteOne({missionID: littleMission._id});
                promiseArray.push(promise);
            });
        }

        let requireMissionResult = await this.ctx.service[`missionProcessingTrackerService`].requireMissionToTrack("enable");
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
                        let savePromise = newMissionTracker.save();
                        promiseArray.push(savePromise);
                    }
                });
            }
        });
        Promise.all(promiseArray).then();
        return requireMissionResult;
    };

    async updateUser(user_uuid, userObj) {
        delete userObj.uuid;
        return this.ctx.model[`UserAccount`].findOneAndUpdate({uuid: user_uuid}, {$set: userObj}, {new: true});
    };

    async updateUserPassword(tel_number, newPassword) {
        return this.ctx.model[`UserAccount`].findOneAndUpdate({tel_number: tel_number},
            {$set: {password: newPassword}}, {new: true});
    };

    async updateUser_login(user) {
        let absoluteDate = this.ctx.getAbsoluteDate();

        return this.ctx.model[`UserAccount`].findOneAndUpdate({uuid: user.uuid}, {
            $inc: {loginTimes: 1}
        }, {new: true});
    };

    async getReferrerID(inviteCode) {

        if (!this.ctx.helper.isEmpty(inviteCode)) {
            let userResult = await this.ctx.model[`UserAccount`].findOne({
                inviteCode: inviteCode
            });
            if (!userResult) {
                this.ctx.throw(`zhaobudao`)
            }
            return userResult._id;
        }
    };

    async addUser(user, inviteCode) {

        let userNew = this.ctx.model[`UserAccount`](user);
        if (!this.ctx.helper.isEmpty(inviteCode)) {
            userNew.referrer = await this.getReferrerID(inviteCode);

            if (!this.ctx.helper.isEmpty(userNew.referrer)) {
                let userx = await this.ctx.model[`UserAccount`].findOneAndUpdate({
                    _id: userNew.referrer
                }, {$push: {referrals: userNew._id}});
                this.ctx.app.eventEmitter.emit(`normalMissionCount`, userx._id, `每日邀新人`);
                this.ctx.app.eventEmitter.emit(`normalMissionCount`, userx._id, `每周邀新人`);


            }
        }
        await userNew.save();
        return userNew;
    };

    async getUser(user, project) {
        return this.ctx.model[`UserAccount`].findOne(user, project);
    };

    async getMyTeam(user_uuid, option) {
        let result = await this.ctx.model[`UserAccount`].findOne({uuid: user_uuid}, {referrals: 1}).populate({
            path: `referrals`,
            model: this.ctx.model[`UserAccount`],
            select: 'nickName -_id created_at avatar tel_number',
        });

        let count = result["referrals"].length;
        let slicedArray = this.ctx.helper.sliceArray(result["referrals"], option);
        return [slicedArray, count];
    };

    async getManyUser(conditions, option, project = {}) {
        if (!this.ctx.helper.isEmpty(conditions.nickName)) {
            conditions.nickName = {$regex: `.*${conditions.nickName}.*`};
        }
        option.sort = {created_at: -1};
        let count = await this.ctx.model[`UserAccount`].countDocuments(conditions);
        let data = await this.ctx.model[`UserAccount`].find(conditions, project, option);
        return [data, count];
    };

    async getUserBalanceListRule(userUUid, option) {

        let result = await this.ctx.model[`UserAccount`].aggregate([{
            $match: {
                "uuid": userUUid,
                "balanceList.createTime": {
                    $gte: new Date(option.beginDate)
                }
            }
        },
            {$sort: {"balanceList.createTime": 1}},
            // {$limit: option.limit},
            // {$skip: option.skip},

            {
                $project: {
                    sizeAmount: {$size: "$balanceList"},
                    balanceList: {
                        $slice: ["$balanceList", option.skip, option.limit]
                    }
                }
            },

            {
                $project: {
                    updated_at: 0,
                    created_at: 0,
                    balanceList: {
                        _id: 0
                    }
                }
            }

        ]);

        if (result.length > 0) {
            let tempArray = result[0].balanceList.sort((a, b) => {
                return b.createTime - a.createTime;
            });
            // let count = await this.ctx.model[`UserAccount`].find
            return [tempArray, result[0].sizeAmount];
        }
        return [];
    };

    async changeBcoin(_id, newBasin_unencrypted) {
        await this.setUser(_id, {Bcoins: newBasin_unencrypted});
    };


//{$set: {Bcoins: newBasin_unencrypted}, $push: {missionTrackers: missionEvent}}, {new: true});
//     async changeUserMoney(_id, newBasin_unencrypted, missionEvent) {
//         if (!missionEvent) {
//             this.ctx.throw(400, `missionEvent missing!`);
//         }
//         this.setUser(_id, {Bcoins: newBasin_unencrypted}, {missionTrackers: missionEvent})
//     }
    async setUserStatus(id, setObj, pushObj) {
        return this.ctx.model[`UserAccount`].findOneAndUpdate({_id: id},
            {$set: setObj, $push: pushObj}, {new: true});
    };

    async setUser(id, setObj, pushObj = {}) {
        return this.ctx.model[`UserAccount`].findOneAndUpdate({_id: id},
            {$set: setObj, $push: pushObj}, {new: true});
    }
}

module.exports = UserService;