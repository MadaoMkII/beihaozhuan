'use strict';
// const LocalStrategy = require('passport-local').Strategy;
// const Logger = require('egg-logger').Logger;
// const FileTransport = require('egg-logger').FileTransport;
const ConsoleTransport = require('egg-logger').ConsoleTransport;
const EventEmitter = require('events');
const RemoteErrorTransport = require('./app/logging/RemoteErrorTransport');

class AppBootHook {
  constructor(app) {
    this.app = app;
  }

  configWillLoad() {
    // Ready to call configDidLoad,
    // Config, plugin files are referred,
    // this is the last chance to modify the config.
  }

  configDidLoad() {
    // Config, plugin files have been loaded.
  }

  async didLoad() {
    // All files have loaded, start plugin here.
  }

  async willReady() {
    const app = this.app;
    app.logger.set('console', new ConsoleTransport({
      level: 'info',
    }));
    // app.getLogger('errorLogger').set('remote', new RemoteErrorTransport({level: 'WARN', app}));


    app.logger.set('remote', new RemoteErrorTransport({
      level: 'WARN', app,
    }));

    // app.getLogger('appLogger').set('remote', new RemoteErrorTransport({level: 'WARN', app}));
    // All plugins have started, can do some thing before app ready
  }

  async didReady() {
    // Worker is ready, can do some things
    // don't need to block the app boot.
    this.app.eventEmitter = new EventEmitter();
    const ctx = this.app.createAnonymousContext();
    this.app.eventEmitter.on('normalMissionCount', async (userId, missionName) => {
      const missionObj = await ctx.model.Mission.findOne({ title: missionName, status: 'enable' });
      if (ctx.helper.isEmpty(missionObj)) {
        // ctx.throw(`监听器任务名匹配有问题，值为${missionName}`);
        console.log(`监听器任务名匹配有问题或者任务没有开启，值为${missionName}`);
      }
      let effectDay;
      switch (missionObj.missionType) {
        case 'Permanent':
          effectDay = 'Permanent';
          break;
        case 'Daily':
          effectDay = this.app.getFormatDate();
          break;
        case 'Weekly':
          effectDay = this.app.getFormatWeek();
          break;
        default:break;
      }


      const missionSearcher = {
        userID: userId,
        missionID: missionObj._id,
        effectDay,
        missionEventName: missionName,
      };
      const modelName = `${missionObj.missionType}MissionProcessingTracker`;

      const res = await ctx.model[modelName].findOneAndUpdate(missionSearcher,
        { $inc: { recentAmount: 1 } },
        { new: true, upsert: true });
      if (!res) {
        this.app.logger.warn(`值为${modelName}`, ctx, missionSearcher);
      }
    });
  }

  async serverDidReady() {
    // Server is listening.

    this.app.passport.serializeUser((ctx, user) => {
      return { uuid: user.uuid, password: user.password };
    });
    this.app.passport.deserializeUser(async (ctx, user) => {
      // console.log('deserializeUser', user);
      return ctx.model.UserAccount.findOne(user);
    });


  }

  async beforeClose() {
    // Do some thing before app close.
  }
}

module.exports = AppBootHook;
