'use strict';
const baseController = require('../controller/baseController');
const { DateTime } = require('luxon');

class userAccount extends baseController {
  async isLogin(ctx) {
    try {
      const userObj = ctx.user;
      // const absoluteDate = ctx.getAbsoluteDate();
      // const promiseArray = [];
      // let triggerFlag = false;
      if (!ctx.helper.isEmpty(userObj)) {
        // if (ctx.helper.isEmpty(userObj.last_login_time) ||
        //             (userObj.last_login_time).toString() !== absoluteDate.toString()) {
        //   triggerFlag = true;
        // } else {
        //   const dailyMission = await this.ctx.model.DailyMissionProcessingTracker.findOne({
        //     userID: userObj._id,
        //     effectDay: absoluteDate,
        //   });
        //   if (ctx.helper.isEmpty(dailyMission)) {
        //     triggerFlag = true;
        //   }
        // }
        // if (triggerFlag) {
        //   const syncingTasksPromise = ctx.service.userService.syncingTasks(userObj);
        //   const updateUser = ctx.service.userService.updateUser(userObj.uuid, { last_login_time: absoluteDate });
        //   promiseArray.push(syncingTasksPromise);
        //   promiseArray.push(updateUser);
        // }
        this.success('用户已经登录', 200);
        // Promise.all(promiseArray).then();
      } else {
        return this.success('用户尚未登录', 200);
      }
    } catch (e) {
      this.app.logger.error(e, ctx);
      this.failure();
    }
  }


  async getUserInfo(ctx) {
    // console.log(ctx.url)
    // console.log(ctx.host)
    // console.log(ctx.path)
    // console.log(ctx.hostname)
    // console.log(ctx.origin)
    // console.log(ctx.is())
    // console.log(ctx.ips)
    // ctx.logger.debug('debug info');
    // ctx.logger.info('some request data: %j', ctx.request.body);
    // ctx.logger.warn('WARNNING!!!!');
    // let promiseArray = [];
    const userObj = ctx.user;
    // let events = ctx.service[`missionEventManager`].getAndInitMissionEvent(ctx.user);
    // promiseArray.push(events);
    this.success(userObj);
    // // ctx.logger.error(new Error('哇', {
    // //     "password": "Abc123",
    // //     "smsVerifyCode": 281105,
    // //     "tel_number": "15620304099"
    // // }),);
    // Promise.all(promiseArray).then(function (values) {
    //     console.log('all promise are resolved', values)
    // }).catch(function (reason) {
    //     console.log('promise reject failed reason')
    // })
  }

  async getUserBalanceList(ctx) {
    try {
      const [ condition, option ] = await this.cleanupRequestProperty('userAccountController.getUserBalanceListRule',
        'unit', 'page', 'period', 'userUUid');
      if (condition !== false) {
        const end = DateTime.fromISO(ctx.getAbsoluteDate().toISOString());

        switch (condition.period) {
          case 'month':
            option.beginDate = end.plus({ months: -1 }).toJSDate();
            break;
          case 'week':
            option.beginDate = end.plus({ week: -1 }).toJSDate();
            break;
          case 'full':
            option.beginDate = new Date('2019-08-26');
            break;
          default:break;
        }
        const userUUid = ctx.helper.isEmpty(condition.userUUid) ? ctx.user.uuid : condition.userUUid;
        const [ result, count ] = await ctx.service.userService.getUserBalanceList(userUUid, option);
        if (ctx.helper.isEmpty(result)) {
          return this.success();
        }
        this.success([ result, count ]);
      }
    } catch (e) {
      this.app.logger.error(e, ctx);
      this.failure();
    }
  }

  async updateUserPassword(ctx) {
    try {
      const [ condition ] = await this.cleanupRequestProperty('authRules.updatePasswordRule',
        'password');
      if (!condition) {
        return;
      }
      if (ctx.helper.isEmpty(ctx.session.fdbsmsVerified) || ctx.session.fdbsmsVerified !== true) {
        return this.failure('找回密码验证失败', 4014, 400);
      }
      const encryptedPassword = ctx.helper.passwordEncrypt(condition.password);
      await ctx.service.userService.updateUserPassword(ctx.session.tel_number, encryptedPassword);
      ctx.session.tel_number = null;
      ctx.session.fdbsmsVerified = true;
      this.success();
    } catch (e) {
      this.app.logger.error(e, ctx);
      this.failure();
    }
  }
  async modifyUserRcoin(ctx) {
    try {
      const [ condition ] = await this.cleanupRequestProperty('userAccountController.modifyUserRcoinRule',
        'tel_number', 'amount', 'content');
      if (!condition) {
        return;
      }
      await this.ctx.service.userService.modifyUserRcoin(condition);
      this.success();
    } catch (e) {
      this.app.logger.error(e, ctx);
      this.failure();
    }
  }

  async updateUserInfo(ctx) {
    try {
      const [ condition ] = await this.cleanupRequestProperty('userAccountController.updateInfoRule',
        'nickName', 'gender', 'birthday', 'location', 'job', 'educationLevel');
      if (!condition) {
        return;
      }
      let ossUrl;
      if (!this.ctx.helper.isEmpty(ctx.request.files)) {
        const file = ctx.request.files[0];
        ossUrl = await ctx.service.picService.putImgs(file);
        condition.avatar = ossUrl;
      }
      const newUser_result = await this.ctx.service.userService.updateUser(ctx.user.uuid, condition);
      // ctx.app.eventEmitter.emit('normalMissionCount', ctx.user._id, '完善用户信息');
      this.success(newUser_result);
    } catch (e) {
      this.app.logger.error(e, ctx);
      this.failure();
    }
  }

  async getManyUser(ctx) {
    try {
      // let result = await ctx.service[`userService`].getManyUser(condition, option);
      const [ condition, option ] = await this.cleanupRequestProperty('userAccountController.findUsersRule',
        'tel_number', 'hasPaid', 'nickName', 'activity', 'hasVerifyWechat', 'unit', 'page', 'source', 'platform');
      if (condition !== false) {
        this.deepCleanUp(condition, 'userStatus', 'activity', 'hasPaid', 'hasVerifyWechat');
        // const [ result, count ] = await this.ctx.service.userService.getManyUser(condition,
        //   option, {
        //     created_at: 1,
        //     Bcoins: 1,
        //     tel_number: 1,
        //     loginTimes: 1,
        //     nickName: 1,
        //     avatar: 1,
        //     balanceList: 1,
        //     userStatus: 1,
        //     uuid: 1,
        //   });
        const result = await ctx.service.excelService.getUserList('本日', condition, option);
        console.log(result);
        const newResult = result.map(e => {

          return {
            uuid: e.uuid,
            tel_number: e.tel_number,
            nickName: e.nickName,
            todayIncoming: e.todayIncoming,
            Bcoins: this.app.decrypt(e.Bcoins),
            userStatus: e.userStatus,
            created_at: this.app.getLocalTime(e.created_at),
            source: e.source,
            platform: e.platform,
          };
        });
        const count = await this.getFindModelCount('UserAccount', condition);
        this.success([ newResult, count ]);
      }
    } catch (e) {
      this.app.logger.error(e, ctx);
      this.failure();
    }
  }

  async getManagementUserInfo(ctx) {
    try {
      const { role } = ctx.request.body;
      let [ condition, option ] = await this.cleanupRequestProperty('userAccountController.getManagementUserInfo',
        'role', 'unit', 'page');
      if (!condition) {
        return;
      }
      if (ctx.helper.isEmpty(role)) {
        condition = { role: { $in: [ '客服', '运营' ] } };
      }

      const newUser = await ctx.service.userService.getManyUser(condition, option, {
        role: 1,
        tel_number: 1,
        nickName: 1,
        updated_at: 1,
        userStatus: 1,
        Bcoins: 1, uuid: 1, realName: 1, source: 1, platform: 1,
      });
      this.success(newUser);
    } catch (e) {
      this.app.logger.error(e, ctx);
      this.failure();
    }

  }

  async setUserStatus(ctx) {
    try {
      const [ condition ] = await this.cleanupRequestProperty('userAccountController.setUserStatusRule',
        'uuid');
      if (!condition) {
        return;
      }
      await ctx.service.userService.updateUser(condition.uuid, { role: '用户' });
      this.success();
    } catch (e) {
      this.app.logger.error(e, ctx);
      this.failure();
    }
  }

  async setUserOpenStatus(ctx) {
    try {
      const [ condition ] = await this.cleanupRequestProperty('userAccountController.setUserStatusRule',
        'uuid', 'activity');
      if (!condition) {
        return;
      }
      await ctx.service.userService.updateUser(condition.uuid, { 'userStatus.activity': condition.activity });
      this.success();
    } catch (e) {
      this.app.logger.error(e, ctx);
      this.failure();
    }
  }

  async setUserRole(ctx) {
    try {
      const [ condition ] = await this.cleanupRequestProperty('userAccountController.getManagementUserInfo',
        'role', 'uuid');

      await ctx.service.userService.updateUser(condition.uuid, condition.role);
      this.success();
    } catch (e) {
      this.app.logger.error(e, ctx);
      this.failure();

    }
  }

  async setUserAdmin(ctx) {
    try {
      const [ condition ] = await this.cleanupRequestProperty('userAccountController.setUserAdminRule',
        'role', 'tel_number', 'realName');
      if (!condition) {
        return;
      }
      const user = await ctx.service.userService.getUser({ tel_number: condition.tel_number });
      delete condition.tel_number;
      await ctx.service.userService.updateUser(user.uuid, condition, { new: true });
      this.success(user);
    } catch (e) {
      this.app.logger.error(e, ctx);
      this.failure();
    }
  }

  async generatorInviteLink(ctx) {
    this.success(`https://www.beihaozhuan.com/index?inviteCode=${ctx.user.inviteCode}`);

  }

  async getMyTeam(ctx) {
    try {
      const [ condition, option ] = await this.cleanupRequestProperty('userAccountController.myTeamRule',
        'unit', 'page', 'uuid');
      if (!condition) {
        return;
      }
      if (ctx.helper.isEmpty(condition.uuid) || ctx.user.role === '用户') {
        condition.uuid = ctx.user.uuid;
      }
      ctx.body = await ctx.service.userService.getMyTeam(condition.uuid, option);
      ctx.body.code = '0';
      ctx.body.msg = 'OK';
      // this.success(result);
    } catch (e) {
      this.app.logger.error(e, ctx);
      this.failure();
    }
  }

  async getUser(ctx) {
    try {
      const [ condition ] = await this.cleanupRequestProperty('userAccountController.setUserStatusRule',
        'uuid');
      if (!condition) {
        return;
      }
      const result = await ctx.service.userService.getUser({ uuid: condition.uuid }, { uuid: 0, password: 0 });
      this.success(result);
    } catch (e) {
      this.app.logger.error(e, ctx);
      this.failure();
    }
  }

  async updateAdmin(ctx) {
    try {
      const [ condition ] = await this.cleanupRequestProperty('userAccountController.setAdminRule',
        'uuid', 'tel_number', 'realName', 'role');
      if (!condition) {
        return;
      }
      const user = await ctx.service.userService.updateUser(condition.uuid, condition);
      if (ctx.helper.isEmpty(user)) {
        return this.failure('找不到这个用户', 4016, 400);
      }
      this.success();
    } catch (e) {
      if (e.message.includes('duplicate')) {
        return this.failure('电话号码已经被使用', 4013, 400);
      }
      this.app.logger.error(e, ctx);
      this.failure();
    }

  }

  async showMyMoney(ctx) {
    try {
      ctx.app.eventEmitter.emit('normalMissionCount', ctx.user._id, '每日晒收入');
      this.success();
    } catch (e) {
      this.app.logger.error(e, ctx);
      this.failure();
    }
  }
  async getMyTodayIncoming(ctx) {
    try {
      const { user } = ctx;
      const result = await ctx.service.userService.getMyTodayIncoming();
      if (this.app.isEmpty(result)) {
        return this.success({
          todayIncoming: 0,
          tel_number: user.tel_number,
          nickName: user.nickName,
        });
      }
      const resObj = {};
      resObj.todayIncoming = result[0].todayIncoming;
      resObj.tel_number = result[0].tel_number;
      resObj.nickName = result[0].nickName;
      return this.success(resObj);


    } catch (e) {
      this.failure();
    }
  }
}

module.exports = userAccount;
