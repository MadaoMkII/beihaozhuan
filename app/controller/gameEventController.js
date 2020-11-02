'use strict';
const Controller = require('./baseController');
class GameEventController extends Controller {

  async completeDownload(ctx) {
    try {
      const [ condition ] = await this.cleanupRequestProperty('gameEventRules.getGameSettingByUUidRule',
        'uuid', 'category');
      if (!condition) {
        return;
      }
      await ctx.service.gameEventService.completeDownload(condition);
      this.success();
    } catch (e) {
      this.app.logger.error(e, ctx);
      this.failure(e);
    }
  }
  async getGameProcessByUUid(ctx) {
    try {
      const [ condition ] = await this.cleanupRequestProperty('gameEventRules.getGameSettingByUUidRule',
        'uuid', 'category');
      if (!condition) {
        return;
      }
      const result = await ctx.service.gameEventService.getGameProcessByUUid(condition);
      this.success(result);
    } catch (e) {
      this.app.logger.error(e, ctx);
      this.failure(e);
    }
  }
  async getRenderData(ctx) {
    try {
      let result;
      if (ctx.user) {
        result = await ctx.service.gameEventService.getRenderData();
      } else {
        const gameEvent = await ctx.service.gameEventService.getRenderDataForUnLogin();
        result = { gameEvent,
          getThisMonthIncoming: {
            totalAmount: 0,
          } };
      }
      this.success(result);
    } catch (e) {
      this.app.logger.error(e, ctx);
      this.failure(e);
    }
  }
  async getMyGameProcess(ctx) {
    try {
      const [ condition ] = await this.cleanupRequestProperty('gameEventRules.noAdmin.withdrewRule',
        'category');
      if (!condition) {
        return;
      }
      const result = await ctx.service.gameEventService.getMyGameProcess(condition);
      // result._doc.content = result._doc.content.map(e => {
      //   const returnResult = e._doc;
      //   delete returnResult._id;
      //   return returnResult;
      // });
      this.success(result);
    } catch (e) {
      this.app.logger.error(e, ctx);
      this.failure(e);
    }
  }
  async withdrewByCategory(ctx) {
    try {
      await this.checkTimeInterval(0.01);
      const [ condition ] = await this.cleanupRequestProperty('gameEventRules.noAdmin.withdrewRule',
        'category');
      if (!condition) {
        return;
      }

      const amount = await ctx.service.gameEventService.withdrewConstraint(condition.category);
      console.log(amount);
      // const result = await ctx.service.gameEventService.withdrew(100, '测试取钱');
      // if (!result || result.result_code === 'FAIL') {
      //   return this.failure('微信服务器连接不稳定,请稍后再试');
      //   // this.app.logger.error(new Error(JSON.stringify(result)), ctx);
      // }
      this.success();
    } catch (e) {
      this.app.logger.error(e, ctx);
      // this.app.logger.error(e, ctx);
      this.failure(e);
    }
  }

  async submitScreenshot(ctx) {
    try {
      const [ condition ] = await this.cleanupRequestProperty('gameEventRules.noAdmin.submitScreenshotRule',
        'screenshotUrl', 'sub_title', 'uuid', 'category');
      if (!condition) {
        return;
      }
      await ctx.service.gameEventService.submitScreenshot(condition);
      this.success();
    } catch (e) {
      this.app.logger.error(e, ctx);
      this.failure(e);
    }
  }
  async completeWatchingMission(ctx) {
    try {
      const [ condition ] = await this.cleanupRequestProperty('gameEventRules.noAdmin.completeWatchingMissionRule',
        'category');
      if (!condition) {
        return;
      }
      await ctx.service.gameEventService.completeWatchingMission(condition);
      this.success();
    } catch (e) {
      this.app.logger.error(e, ctx);
      this.failure(e);
    }
  }
  async initialGameEventByStep(ctx) {
    try {
      const [ condition ] = await this.cleanupRequestProperty('gameEventRules.noAdmin.initialGameEventByStepRule',
        'category');
      if (!condition) {
        return;
      }
      const result = await ctx.service.gameEventService.initialGameEventByStep(condition);
      if (!result) {
        this.ctx.throw(200, '已经初始化过这个阶段的任务了');
      }
      this.success();
    } catch (e) {
      this.app.logger.error(e, ctx);
      this.failure(e);
    }
  }
  async getThisMonthIncoming(ctx) {
    try {
      const result = await ctx.service.gameEventService.getThisMonthIncoming();
      this.success(result);
    } catch (e) {
      this.app.logger.error(e, ctx);
      this.failure(e);
    }
  }

  // ------------admin only----------------------
  async getGameSetting(ctx) {
    try {
      const [ condition ] = await this.cleanupRequestProperty('gameEventRules.getGameSettingByUUidRule',
        'category', 'uuid');
      if (!condition) {
        return;
      }
      const result = await ctx.service.gameEventService.getGameSetting(condition);
      this.success(result);
    } catch (e) {
      this.app.logger.error(e, ctx);
      this.failure(e);
    }
  }
  async approveAuditUploadRecord(ctx) {
    try {
      const [ condition ] = await this.cleanupRequestProperty('gameEventRules.noAdmin.approveAuditUploadRecordRule',
        'decision', 'uuid');
      if (!condition) {
        return;
      }
      await ctx.service.gameEventService.approveAuditUploadRecord(condition);
      this.success();
    } catch (e) {
      this.app.logger.error(e, ctx);
      this.failure(e);
    }
  }
  async createEventGameSetting(ctx) {
    try {
      const [ condition ] = await this.cleanupRequestProperty('gameEventRules.createGameEventGameSettingRule',
        'category', 'gameName', 'platform', 'gameBannerUrl', 'downloadUrl',
        'demoDescription', 'demoReward', 'demoSketchUrl', 'subsequent_A', 'subsequent_B');
      if (!condition) {
        return;
      }
      if (condition.category === 'STEP1') {
        delete condition.subsequent_A;
        delete condition.subsequent_B;
      }
      await ctx.service.gameEventService.createEventGameSetting(condition);
      this.success();
    } catch (e) {
      this.app.logger.error(e, ctx);
      this.failure(e);
    }
  }
  async deleteEventGameSetting(ctx) {
    try {
      const [ condition ] = await this.cleanupRequestProperty('gameEventRules.deleteEventGameSettingRule',
        'uuid');
      if (!condition) {
        return;
      }
      const result = await ctx.service.gameEventService.deleteEventGameSetting(condition);
      this.success(result);
    } catch (e) {
      this.app.logger.error(e, ctx);
      this.failure(e);
    }
  }
  async getEventGameByCategory(ctx) {
    try {
      const [ condition ] = await this.cleanupRequestProperty('gameEventRules.getEventGameSettingListRule',
        'category');
      if (!condition) {
        return;
      }
      const result = await ctx.service.gameEventService.getEventGameSettingList(condition, { gameSetting: 0 });
      this.success(result);
    } catch (e) {
      this.app.logger.error(e, ctx);
      this.failure(e);
    }
  }
  async getEventGameSettingList(ctx) {
    try {
      const [ condition ] = await this.cleanupRequestProperty('gameEventRules.getEventGameSettingListRule',
        'category');
      if (!condition) {
        return;
      }
      const result = await ctx.service.gameEventService.getEventGameSettingList(condition, { gameSetting: 1 });
      // result = result.sort((a, b) => a.updated_at - b.updated_at);
      this.success(result);
    } catch (e) {
      this.app.logger.error(e, ctx);
      this.failure(e);
    }
  }
  async updateEventGameSetting(ctx) {
    try {
      const [ condition ] = await this.cleanupRequestProperty('gameEventRules.updateEventGameSettingRule',
        'uuid', 'category', 'gameName', 'platform', 'gameBannerUrl', 'downloadUrl',
        'demoDescription', 'demoReward', 'demoSketchUrl', 'subsequent_A', 'subsequent_B');
      if (!condition) {
        return;
      }
      if (condition.category === 'STEP1') {
        delete condition.subsequent_A;
        delete condition.subsequent_B;
      }
      await ctx.service.gameEventService.updateEventGameSetting(condition);
      this.success();
    } catch (e) {
      this.app.logger.error(e, ctx);
      this.failure(e);
    }
  }
  async setGameEvent(ctx) {
    try {
      const [ condition ] = await this.cleanupRequestProperty('gameEventRules.createGameEventRule',
        'category', 'description_short', 'expectEarning', 'videoTutorialUrl', 'firstWatchEarning', 'registerReward');
      if (!condition) {
        return;
      }
      await ctx.service.gameEventService.setGameEvent(condition);
      this.success();
    } catch (e) {
      this.app.logger.error(e, ctx);
      this.failure(e);
    }
  }

  async getAuditUploadRecordList(ctx) {
    try {
      const [ condition, option ] = await this.cleanupRequestProperty('gameEventRules.getAuditUploadRecordListRule',
        'tel_number', 'status', 'page', 'unit', 'sub_title', 'missionUUid');
      if (!condition) {
        return;
      }
      if (!ctx.app.isEmpty(condition.tel_number)) {
        condition.tel_number = { $regex: `.*${condition.tel_number}.*` };
      }
      option.sort = { status: 1, created_at: -1 };
      const result = await ctx.service.gameEventService.getAuditUploadRecordList(condition, option);
      const count = await this.getFindModelCount('AuditUploadRecord', condition);
      this.success([ result, count ]);
    } catch (e) {
      this.app.logger.error(e, ctx);
      this.failure(e);
    }
  }
}
module.exports = GameEventController;
