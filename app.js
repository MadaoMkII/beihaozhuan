'use strict';
//const LocalStrategy = require('passport-local').Strategy;
const Logger = require('egg-logger').Logger;
const FileTransport = require('egg-logger').FileTransport;
const ConsoleTransport = require('egg-logger').ConsoleTransport;
module.exports = app => {
    // 挂载 strategy

    // logger.set('file', new FileTransport({
    //     file: '/path/to/file',
    //     level: 'INFO',
    // }));
    // logger.set('console', new ConsoleTransport({
    //     level: 'DEBUG',
    // }));
    // app.passport.use(new LocalStrategy({
    //     usernameField: 'username',
    //     passwordField: 'password',
    //     passReqToCallback: true,
    // }, (req, username, password, done) => {
    //     // format user
    //     const user = {
    //         provider: 'local',
    //         username,
    //         password,
    //     };
    //     console.log('%s %s get user: %j', req.method, req.url, user);
    //     app.passport.doVerify(req, user, done);
    //
    // }));
    // app.passport.verify(async (ctx, user) => {
    //
    //
    // });
    // 处理用户信息
    // app.passport.verify(async (ctx, user) => {
    //     //ctx.logger.debug('passport.verify', user);
    //     console.log(user);
    //     let loginResult = await ctx.model.User.findOne({username: user.username, password: user.password});
    //     ctx.response.status = 200;
    //      ctx.response.body = {name: "OK"};
    //      console.log(ctx.response)
    //
    //     return {username:'abc',password:'123'};
    // });
    app.passport.serializeUser((ctx, user) => {
        return {uuid: user.uuid, password: user.password};
    });
    app.passport.deserializeUser(async (ctx, user) => {
        //console.log('deserializeUser', user);
        return ctx.model.UserAccount.findOne(user).populate(`dailyMissionTrackers`);
    });

};