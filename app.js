'use strict';
//const LocalStrategy = require('passport-local').Strategy;
// const Logger = require('egg-logger').Logger;
// const FileTransport = require('egg-logger').FileTransport;
// const ConsoleTransport = require('egg-logger').ConsoleTransport;
const EventEmitter = require('events');
module.exports = app => {
    // 挂载 strategy
    app.eventEmitter = new EventEmitter();
    const ctx = app.createAnonymousContext();
    app.eventEmitter.on(`normalMissionCount`, async (userId, missionName) => {

        let missionObj = await ctx.model.Mission.findOne({title: missionName});
        if (ctx.helper.isEmpty(missionObj)) {
            //ctx.throw(`监听器任务名匹配有问题，值为${missionName}`);
            throw new Error(`监听器任务名匹配有问题，值为${missionName}`)
        }
        let effectDay;
        switch (missionObj.missionType) {
            case `Permanent`:
                effectDay = `Permanent`;
                break;
            case `Daily`:
                effectDay = app.getFormatDate();
                break;
            case `Weekly`:
                effectDay = app.getFormatWeek();
                break;
        }


        let missionSearcher = {
            userID: userId,
            missionID: missionObj._id,
            effectDay: effectDay,
            missionEventName: missionName
        };
        let modelName = `${missionObj.missionType}MissionProcessingTracker`;

        let res = await ctx.model[modelName].findOneAndUpdate(missionSearcher,
            {$inc: {recentAmount: 1}},
            {new: true});

        if (!res) {
            console.log(missionSearcher)
            console.log(`值为${modelName}`);

        }
    });
    // logger.set('file', new FileTransport({
    //     file: '/path/to/file',
    //     level: 'INFO',
    // }));
    // logger.set('console', new ConsoleTransport({
    //     level: 'DEBUG',
    // }));

    app.passport.serializeUser((ctx, user) => {
        return {uuid: user.uuid, password: user.password};
    });
    app.passport.deserializeUser(async (ctx, user) => {
        //console.log('deserializeUser', user);
        return ctx[`model`][`UserAccount`].findOne(user);
    });

};