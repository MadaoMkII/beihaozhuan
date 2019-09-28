'use strict';
//const LocalStrategy = require('passport-local').Strategy;
const Logger = require('egg-logger').Logger;
const FileTransport = require('egg-logger').FileTransport;
const ConsoleTransport = require('egg-logger').ConsoleTransport;
const EventEmitter = require('events');
module.exports = app => {
    // 挂载 strategy
    app.eventEmitter = new EventEmitter();
    const ctx = app.createAnonymousContext();
    app.eventEmitter.on(`play`,(event)=>{
        console.log(obj)
        console.log(`我在这里2`)
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
        return ctx.model.UserAccount.findOne(user).populate(`dailyMissionTrackers`);
    });

};