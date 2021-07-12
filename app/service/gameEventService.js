'use strict';
const BaseService = require('./baseService');
const uuid = require('cuid');

// require('moment-timezone');

class gameEventService extends BaseService {
  constructor(ctx) {
    super(ctx);
    const { isEmpty } = this.app;
    const { getLocalTime } = this.app;
    this.isEmpty = isEmpty;
    this.getLocalTime = getLocalTime;
  }

  async recordDownload(condition) {
    const today = this.getBeginOfDay();
    const queryObj = {
      analyzeDate: today,
      type: 'download_daily',
      category: condition.name,
      category_2: condition.gameUUid,
      // 'dataArray.tel_number': condition.tel_number,
    };

    await this.ctx.model.AnalyzeLog.updateOne(queryObj, {
      $inc: { totalAmount: 1 },
      $addToSet: { dataArray: condition.tel_number },
    }, { upsert: true });

    // const isExists = await this.ctx.model.AnalyzeLog.exists(queryObj);
    // console.log(isExists);
    // if (isExists) {
    //   const lastAnalyzeLog = await this.ctx.model.AnalyzeLog.updateOne(queryObj,
    //     { $inc: { totalAmount: 1, 'dataArray.$.amount': 1 } });
    // } else {
    //   delete queryObj['dataArray.tel_number'];
    //   await this.ctx.model.AnalyzeLog.updateOne(queryObj, {
    //     $push: {
    //       dataArray: {
    //         tel_number: condition.tel_number,
    //         amount: 1,
    //       },
    //     }, $inc: { totalAmount: 1 },
    //   }, { upsert: true });
    //
    //
    // }

  }

  async completeDownload(condition) {
    const { tel_number } = this.ctx.user;
    await this.ctx.model.GameProcess.updateOne({
      tel_number,
      category: condition.category,
      'content.uuid': condition.uuid,
    }, {
      $set: { 'content.$.hasDownloaded': true },
    });
  }

  async getGameProcessByUUid(condition) {
    const { tel_number } = this.ctx.user;
    const setter = {};
    setter.category = condition.category;
    setter.tel_number = tel_number;
    const userGameProcess = await this.ctx.model.GameProcess.findOne(setter);

    const allGameEvent = await this.ctx.model.GameEvent.findOne({ category: condition.category });
    const tempResult = userGameProcess.content.find(e => e.uuid === condition.uuid);
    if (this.isEmpty(tempResult)) {
      this.ctx.throw(400, '找不到这个uuid对应的');
    }
    if (this.isEmpty(userGameProcess)) {
      this.ctx.throw(400, '这个阶段的任务还没有初始化');
    }
    if (!tempResult.done) {
      let auditUploadRecord = await this.ctx.model.AuditUploadRecord.find({
        tel_number,
        missionUUid: condition.uuid,
      });

      if (!this.isEmpty(auditUploadRecord)) {
        auditUploadRecord = auditUploadRecord.sort((a, b) => b.updated_at - a.updated_at);
      }
      const setting = allGameEvent.gameSetting.find(e => e.uuid === condition.uuid);
      const recordA = auditUploadRecord.find(e => e.sub_title === 'A');
      const recordB = auditUploadRecord.find(e => e.sub_title === 'B');
      const recordTry = auditUploadRecord.find(e => e.sub_title === 'try');
      const checkStatus = function(record, isEmpty) {
        if (isEmpty(record)) {
          return '未提交';
        }
        return record.status;

      };
      tempResult._doc.subsequent_A = setting.subsequent_A;
      tempResult._doc.subsequent_B = setting.subsequent_B;

      tempResult._doc.gameName = setting.gameName;
      tempResult._doc.platform = setting.platform;
      tempResult._doc.gameBannerUrl = setting.gameBannerUrl;
      tempResult._doc.downloadUrl = setting.downloadUrl;
      tempResult._doc.demoDescription = setting.demoDescription;
      tempResult._doc.demoSketchUrl = setting.demoSketchUrl;
      tempResult._doc.demoReward = setting.demoReward;

      tempResult._doc.status_mission_A = checkStatus(recordA, this.isEmpty);
      tempResult._doc.status_mission_B = checkStatus(recordB, this.isEmpty);
      tempResult._doc.status_mission_try = checkStatus(recordTry, this.isEmpty);
      tempResult._doc.screenshotUrl_mission_try = this.isEmpty(recordTry) ? '' : recordTry.screenshotUrl;
      tempResult._doc.screenshotUrl_mission_A = this.isEmpty(recordA) ? '' : recordA.screenshotUrl;
      tempResult._doc.screenshotUrl_mission_B = this.isEmpty(recordB) ? '' : recordB.screenshotUrl;
      delete tempResult._doc._id;
      // delete tempResult.gameProcessing._doc.platform;
      delete tempResult._doc.uuid;
      // delete tempResult.gameProcessing._doc.gameName;
      // delete tempResult.gameProcessing._doc.amount_mission_try;
      // delete tempResult.gameProcessing._doc.gameSketchUrl;
    }

    return tempResult;
  }

  async getGameSetting(condition) {
    const setter = {};
    setter.category = condition.category;
    const singleGameEvent = await this.ctx.model.GameEvent.findOne(setter);

    if (this.isEmpty(singleGameEvent)) {
      this.ctx.throw(400, '这个阶段的任务还没有设置');
    }
    const result = singleGameEvent.gameSetting.find(e => e.uuid === condition.uuid);
    delete result._doc._id;
    result._doc.updated_at = this.app.getLocalTime(result._doc.updated_at);
    return result;
  }

  // async getGameProcessByUUid(condition) {
  //   const setter = {};
  //   const tempResult = {};
  //   setter.category = condition.category;
  //   const { tel_number } = this.ctx.user;
  //   const singleGameEvent = await this.ctx.model.GameEvent.findOne(setter);
  //   setter.tel_number = tel_number;
  //
  //   const userGameProcess = await this.ctx.model.GameProcess.findOne(setter);
  //
  //   const singleGameSetting = singleGameEvent.gameSetting.find(e => e.uuid === condition.uuid);
  //   tempResult.gameSetting = {
  //     uuid: singleGameSetting.uuid,
  //     gameName: singleGameSetting.gameName,
  //     platform: singleGameSetting.platform,
  //     gameBannerUrl: singleGameSetting.gameBannerUrl,
  //     downloadUrl: singleGameSetting.downloadUrl,
  //     demoDescription: singleGameSetting.demoDescription,
  //     demoReward: singleGameSetting.demoReward,
  //     demoSketchUrl: singleGameSetting.demoSketchUrl,
  //   };
  //   tempResult.stepSetting = {
  //     currentIncoming: userGameProcess.currentIncoming,
  //     requiredIncoming: userGameProcess.requiredIncoming,
  //     category: singleGameEvent.category,
  //     description_short: singleGameEvent.description_short,
  //     // expectEarning: singleGameEvent.expectEarning,
  //     videoTutorialUrl: singleGameEvent.videoTutorialUrl,
  //     firstWatchEarning: singleGameEvent.firstWatchEarning,
  //     registerReward: singleGameEvent.registerReward,
  //   };
  //   tempResult.gameProcessing = userGameProcess.content.find(e => e.uuid === condition.uuid);
  //
  //   // if (!tempResult.gameProcessing.done) {
  //   //   const auditUploadRecord = await this.ctx.model.AuditUploadRecord.find({
  //   //     tel_number,
  //   //     missionUUid: condition.uuid });
  //   //
  //   //   const recordA = auditUploadRecord.find(e => e.sub_title === 'A');
  //   //   const recordB = auditUploadRecord.find(e => e.sub_title === 'B');
  //   //   const recordTry = auditUploadRecord.find(e => e.sub_title === 'try');
  //   //   const checkStatus = function(record, isEmpty) {
  //   //     if (isEmpty(record)) {
  //   //       return '待提交';
  //   //     }
  //   //     return record.status;
  //   //
  //   //   };
  //   //   tempResult.gameProcessing._doc.status_mission_A = checkStatus(recordA, this.isEmpty);
  //   //   tempResult.gameProcessing._doc.status_mission_B = checkStatus(recordB, this.isEmpty);
  //   //   tempResult.gameProcessing._doc.status_mission_try = checkStatus(recordTry, this.isEmpty);
  //   //   tempResult.gameProcessing._doc.screenshotUrl_mission_try = this.isEmpty(recordTry) ? '' : recordTry.screenshotUrl;
  //   //   tempResult.gameProcessing._doc.screenshotUrl_mission_A = this.isEmpty(recordA) ? '' : recordA.screenshotUrl;
  //   //   tempResult.gameProcessing._doc.screenshotUrl_mission_B = this.isEmpty(recordB) ? '' : recordB.screenshotUrl;
  //   //   delete tempResult.gameProcessing._doc._id;
  //   //   delete tempResult.gameProcessing._doc.platform;
  //   //   delete tempResult.gameProcessing._doc.uuid;
  //   //   delete tempResult.gameProcessing._doc.gameName;
  //   //   delete tempResult.gameProcessing._doc.amount_mission_try;
  //   //   delete tempResult.gameProcessing._doc.gameSketchUrl;
  //   // }
  //
  //   return tempResult;
  // }

  async getRenderDataForUnLogin(condition) {
    const setter = {};
    const finalResult = [];
    if (!this.isEmpty(condition)) {
      if (!this.isEmpty(condition.category)) {
        setter.category = condition.category;
      }
    }
    const allGameEvent = await this.ctx.model.GameEvent.find(setter);
    for (const gameEvent of allGameEvent) {
      const tempResult = {};
      tempResult.gameSetting = [];
      tempResult.category = gameEvent.category;
      tempResult.stepSetting = {
        description_short: gameEvent.description_short,
        expectEarning: gameEvent.expectEarning,
        status: '进行中',
        videoTutorialUrl: gameEvent.videoTutorialUrl,
        firstWatchEarning: gameEvent.firstWatchEarning,
        registerReward: gameEvent.registerReward, // 只有第一部有
      };
      if (tempResult.category !== 'STEP1') {
        tempResult.stepSetting.status = '未开始';
      }
      if (!this.isEmpty(gameEvent.gameSetting)) {
        for (const gameSetting of gameEvent.gameSetting) {
          const tempObj = {
            uuid: gameSetting.uuid,
            done: false,
            platform: gameSetting.platform,
            gameName: gameSetting.gameName,
            hasDownloaded: false,
            complete_mission_try: false,
            subsequent_A: gameSetting.subsequent_A,
            subsequent_B: gameSetting.subsequent_B,
            demoReward: gameSetting.demoReward,
            gameBannerUrl: gameSetting.gameBannerUrl,
            downloadUrl: gameSetting.downloadUrl,
            demoDescription: gameSetting.demoDescription,
            complete_mission_A: false,
            complete_mission_B: false,
          };
          tempResult.gameSetting.push(tempObj);
        }
      } else {
        tempResult.gameSetting = [];
      }

      finalResult.push(tempResult);
    }
    return finalResult;
  }

  async getRenderData(condition) {
    const setter = {};
    if (!this.isEmpty(condition)) {
      if (!this.isEmpty(condition.category)) {
        setter.category = condition.category;
      }
    }
    await this.initialGameEventByStep({ category: 'STEP1' });

    const finalResult = {};
    finalResult.getThisMonthIncoming = await this.getThisMonthIncoming();
    finalResult.gameEvent = [];
    const { tel_number } = this.ctx.user;
    const allGameEvent = await this.ctx.model.GameEvent.find(setter);
    setter.tel_number = tel_number;
    const userGameProcess = await this.ctx.model.GameProcess.find(setter);
    for (const gameEvent of allGameEvent) {
      const tempResult = {};
      const processContent = userGameProcess.find(e => e.category === gameEvent.category);
      tempResult.category = gameEvent.category;
      if (this.isEmpty(processContent)) {
        tempResult.stepSetting = {
          currentIncoming: 0,
          tel_number,
          status: '未开始',
          complete_mission_watchVideo: false,
          description_short: gameEvent.description_short,
          expectEarning: gameEvent.expectEarning,
          videoTutorialUrl: gameEvent.videoTutorialUrl,
          firstWatchEarning: gameEvent.firstWatchEarning,
          registerReward: gameEvent.registerReward,
        };
        if (this.isEmpty(gameEvent.gameSetting)) {
          tempResult.gameSetting = [];
        } else {
          for (const contentEntity of gameEvent.gameSetting) {
            tempResult.gameSetting = [];
            const tempObject = {};
            tempObject.uuid = contentEntity.uuid;
            tempObject.done = false;
            tempObject.platform = contentEntity.platform;
            tempObject.gameName = contentEntity.gameName;
            tempObject.gameSketchUrl = contentEntity.gameSketchUrl;
            tempObject.hasDownloaded = false;
            tempObject.complete_mission_try = false;
            tempObject.subsequent_A = contentEntity.subsequent_A;
            tempObject.subsequent_B = contentEntity.subsequent_B;
            tempObject.demoReward = contentEntity.demoReward;
            tempObject.gameBannerUrl = contentEntity.gameBannerUrl;
            tempObject.downloadUrl = contentEntity.downloadUrl;
            tempObject.demoDescription = contentEntity.demoDescription;
            tempObject.demoSketchUrl = contentEntity.demoSketchUrl;
            tempObject.complete_mission_try = false;
            if (tempObject.subsequent_A.available) {
              tempObject.complete_mission_A = false;
            }
            if (tempObject.subsequent_B.available) {
              tempObject.complete_mission_B = false;
            }
            tempResult.gameSetting.push(tempObject);
          }

        }
        finalResult.gameEvent.push(tempResult);
      } else {
        tempResult.stepSetting = {
          currentIncoming: processContent.currentIncoming,
          tel_number: processContent.tel_number,
          category: processContent.category,
          status: processContent.status,
          complete_mission_watchVideo: processContent.complete_mission_watchVideo,
          // amount_mission_watchVideo: processContent.amount_mission_watchVideo,
          description_short: gameEvent.description_short,
          expectEarning: gameEvent.expectEarning,
          videoTutorialUrl: gameEvent.videoTutorialUrl,
          firstWatchEarning: gameEvent.firstWatchEarning,
          registerReward: gameEvent.registerReward,
        };
        if (!this.isEmpty(gameEvent.gameSetting)) {
          const tempArray = [];
          for (const contentEntity of gameEvent.gameSetting) {
            tempResult.gameSetting = [];
            const gameEventEntity = processContent.content.find(e => e.uuid === contentEntity.uuid);
            if (this.isEmpty(gameEventEntity)) {
              const processEntity = {
                platform: contentEntity.platform,
                uuid: contentEntity.uuid,
                done: false,
                gameName: contentEntity.gameName,
                gameSketchUrl: contentEntity.demoSketchUrl,
                hasDownloaded: false,
                complete_mission_try: false,
                amount_mission_try: contentEntity.demoReward,
              };
              if (contentEntity.subsequent_A.available) {
                processEntity.complete_mission_A = false;
                processEntity.amount_mission_A = contentEntity.subsequent_A.subsequentReward;
              }
              if (contentEntity.subsequent_B.available) {
                processEntity.complete_mission_B = false;
                processEntity.amount_mission_B = contentEntity.subsequent_B.subsequentReward;
              }
              await this.ctx.model.GameProcess.updateOne({
                tel_number: this.ctx.user.tel_number,
                category: gameEvent.category,
              }, {
                $push: {
                  content: processEntity,
                },
              });
              continue;
            }
            const tempObject = Object.assign(gameEventEntity._doc, contentEntity._doc);
            delete tempObject._id;
            tempObject.updated_at = this.app.getLocalTime(tempObject.updated_at);
            tempObject.amount_mission_try = undefined;
            tempObject.amount_mission_A = undefined;
            tempObject.amount_mission_B = undefined;
            tempArray.push(tempObject);
          }
          tempResult.gameSetting = tempArray;
        } else {
          tempResult.gameSetting = [];
        }

        finalResult.gameEvent.push(tempResult);
      }
    }
    return finalResult;

  }

  async getMyGameProcess(condition) {
    const { tel_number } = this.ctx.user;
    return this.ctx.model.GameProcess.findOne({ tel_number, category: condition.category });
  }

  async submitScreenshot(condition) {
    const { tel_number } = this.ctx.user;

    const oldAuditUploadRecord = await this.ctx.model.AuditUploadRecord.findOne(
      {
        tel_number,
        missionUUid: condition.uuid,
        status: '未审核',
      });
    if (!this.isEmpty(oldAuditUploadRecord)) {
      this.ctx.throw(400, '已经存在了未审批的请求');
      const simpleValue = { try: 1, A: 2, B: 3 };
      if (simpleValue[oldAuditUploadRecord.sub_title] - simpleValue[condition.sub_title] === 0) {
        this.ctx.throw(400, '已经提交过同类的请求');
      }
      if (-simpleValue[oldAuditUploadRecord.sub_title] + simpleValue[condition.sub_title] < 1) {
        this.ctx.throw(400, '你已经完成了前面的任务');
      }
      if (-simpleValue[oldAuditUploadRecord.sub_title] + simpleValue[condition.sub_title] > 1) {
        this.ctx.throw(400, '你必须完成前面的任务');
      }
    }
    // else {
    //   if (condition.sub_title !== 'try') {
    //     this.ctx.throw(400, '必须先完成试玩任务才可以提交后续证明');
    //   }
    // }
    const thisUUid = uuid();

    if (this.isEmpty(condition.uuid)) {
      this.ctx.throw(400, '不为STEP1时候必须有uuid字段');
    }
    if (this.isEmpty(condition.sub_title)) {
      this.ctx.throw(400, '不为STEP1时候必须有sub_title字段');
    }
    const oldGameProcess = await this.ctx.model.GameProcess.findOne({
      tel_number,
      category: condition.category,
      // status: '进行中',
      'content.uuid': condition.uuid,
      'content.done': false,
    });
    if (this.isEmpty(oldGameProcess)) {
      this.ctx.throw(400, '找不到对应的记录');
    }
    const processContent = oldGameProcess.content.find(element => {
      return element.uuid === condition.uuid;
    });
    const gameName = processContent.gameName;
    let increaseAmount;
    if (condition.sub_title === 'try') {
      increaseAmount = processContent.amount_mission_try;
    }
    if (condition.sub_title === 'A') {
      increaseAmount = processContent.amount_mission_A;
    }
    if (condition.sub_title === 'B') {
      increaseAmount = processContent.amount_mission_B;
    }
    const auditUploadRecord = new this.ctx.model.AuditUploadRecord({
      uuid: thisUUid,
      name: gameName,
      category: condition.category,
      missionUUid: condition.uuid, // STEP1没有
      tel_number: this.ctx.user.tel_number,
      sub_title: condition.sub_title,
      hasDownloaded: true,
      status: '未审核',
      increaseAmount,
      screenshotUrl: condition.screenshotUrl,
    });
    auditUploadRecord.save();
  }

  async completeWatchingMission(condition) {
    const { tel_number } = this.ctx.user;
    const oldGameProcess = await this.ctx.model.GameProcess.findOne({
      tel_number,
      category: condition.category,
    });

    if (this.isEmpty(oldGameProcess)) {
      this.ctx.throw(400, '还没有初始化这个阶段的任务');
    }
    if (oldGameProcess.complete_mission_watchVideo) {
      this.ctx.throw(400, '这个任务已经被完成了');
    }

    const setter = { complete_mission_watchVideo: true };
    if (oldGameProcess.requiredIncoming <= oldGameProcess.currentIncoming + oldGameProcess.amount_mission_watchVideo) {
      setter.status = '已完成';
    }
    await this.ctx.model.GameProcess.updateOne({
      tel_number,
      category: condition.category,
    },
    {
      $set: setter,
      $inc: { currentIncoming: oldGameProcess.amount_mission_watchVideo },
    });
    const increaseAmount = oldGameProcess.amount_mission_watchVideo;

    await this.ctx.service.userService.modifyUserRcoin({
      tel_number,
      amount: Number(increaseAmount),
      content: `活动奖励-${oldGameProcess.category}-首次观看视频奖励`,
      type: '活动',
    });

    // await this.dataIncrementRecord(`活动奖励-${oldGameProcess.category}-首次观看视频奖励`, increaseAmount, 'bcoin', '活动');
    // await this.setUserBcionChange(tel_number,
    //   `活动奖励-${oldGameProcess.category}-首次观看视频奖励`,
    //   '获得', increaseAmount, newMoney);

  }

  async initialGameEventByStep(condition) {
    let gameEventEntity;
    const isExists = await this.ctx.model.GameProcess.exists({
      tel_number: this.ctx.user.tel_number,
      category: condition.category,
    });
    if (isExists) {
      return false; //
    }
    const gameEvent = await this.ctx.model.GameEvent.findOne({ category: condition.category });
    if (!gameEvent) {
      return { }; //
    }
    if (condition.category === 'STEP1') {
      if (this.isEmpty(gameEvent.gameSetting[0].platform)) {
        this.ctx.throw(400, 'STEP1还没有进行游戏设置');
      }
      const element = gameEvent.gameSetting[0];
      gameEventEntity = new this.ctx.model.GameProcess({
        tel_number: this.ctx.user.tel_number,
        category: condition.category,
        status: '进行中',
        currentIncoming: 0,
        requiredIncoming: gameEvent.expectEarning,
        complete_mission_watchVideo: false,
        amount_mission_watchVideo: gameEvent.firstWatchEarning,
        content: [
          {
            uuid: element.uuid,
            done: false,
            platform: element.platform,
            gameName: element.gameName,
            gameSketchUrl: element.demoSketchUrl,
            hasDownloaded: false,
            complete_mission_try: false,
            amount_mission_try: element.demoReward,
          },

        ],
      });
    } else {
      let contentArray = gameEvent.gameSetting.map(element => {
        const returnValue = {
          uuid: element.uuid,
          done: false,
          platform: element.platform,
          gameName: element.gameName,
          gameSketchUrl: element.demoSketchUrl,
          hasDownloaded: false,
          complete_mission_try: false,
          amount_mission_try: element.demoReward,
        };
        if (element.subsequent_A.available) {
          returnValue.complete_mission_A = false;
          returnValue.amount_mission_A = element.subsequent_A.subsequentReward;
        }
        if (element.subsequent_B.available) {
          returnValue.complete_mission_B = false;
          returnValue.amount_mission_B = element.subsequent_B.subsequentReward;
        }
        return returnValue;
      }
      );
      contentArray = contentArray.filter(element => !this.isEmpty(element));

      gameEventEntity = new this.ctx.model.GameProcess({
        tel_number: this.ctx.user.tel_number,
        category: condition.category,
        status: '进行中',
        currentIncoming: 0,
        requiredIncoming: gameEvent.expectEarning,
        complete_mission_watchVideo: false,
        amount_mission_watchVideo: gameEvent.firstWatchEarning,
        content: contentArray,
      });
    }
    gameEventEntity.save();
  }

  async getThisMonthIncoming() {
    const { tel_number } = this.ctx.user;

    const query = this.getTimeQueryByPeriod('本月', new Date(), 'createTime');
    query.amount = { $gt: 0 };
    const result = await this.ctx.model.UserAccount.aggregate([

      { $match: { tel_number } },
      { $project: { balanceList: 1 } },
      { $unwind: '$balanceList' },
      {
        $project: {
          income: '$balanceList.income',
          amount: '$balanceList.amount',
          createTime: '$balanceList.createTime',
        },
      },
      { $match: query },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
        },
      },
      { $project: { _id: 0 } },
    ]);
    return !this.isEmpty(result[0]) ? result[0] : {
      totalAmount: 0,
    };
  }

  async withdrewConstraint(category) {
    const { tel_number } = this.ctx.user;
    const oldGameProcess = await this.ctx.model.GameProcess.findOne({ category, tel_number });
    if (this.isEmpty(oldGameProcess)) {
      this.ctx.throw(400, '任务根本还没做呢');
    }
    if (oldGameProcess.hasWithdrew) {
      this.ctx.throw(400, '已经取过钱了');
    }
    if (oldGameProcess.currentIncoming < oldGameProcess.requiredIncoming) {
      this.ctx.throw(400, '任务没有到达要求');
    }
    const newGameProcess = await this.ctx.model.GameProcess.findOneAndUpdate({ category, tel_number },
      { $set: { hasWithdrew: true } }, { new: true });
    return newGameProcess.requiredIncoming;
  }

  // async withdrew(amount, desc) {
  // const path = require('path');
  // const xml2js = require('xml2js');
  //   const toQueryString = async function(obj) {
  //     return Object.keys(obj)
  //       .filter(key => key !== 'sign' && obj[key] !== void 0 && obj[key] !== '')
  //       .sort()
  //       .map(key => key + '=' + obj[key])
  //       .join('&');
  //   };
  //
  //   const getSign = async function(params, type = 'MD5') {
  //     const str = await toQueryString(params) + '&key=' + this.ctx.app.config.wechatConfig.key;
  //     let signedStr = '';
  //     switch (type) {
  //       case 'MD5':
  //         signedStr = String(require('md5')(str)).toUpperCase();
  //         break;
  //       case 'SHA1':
  //         signedStr = String(require('sha1')(str)).toUpperCase();
  //         break;
  //       default:
  //         throw new Error('signType Error');
  //     }
  //     return [ str, signedStr ];
  //   };
  //
  //   const user = this.ctx.user;
  //   const recentUserAccount = await this.ctx.model.UserAccount.findOne({ tel_number: user.tel_number });
  //   if (Number(recentUserAccount.Bcoins) < Number(amount)) {
  //     this.ctx.throw(200, '用户余额不足');
  //   }
  //   const ip = this.ctx.getIP(this.ctx.request);
  //   const partner_trade_no = 100 + this.ctx.helper.randomNumber(10);
  //   const inputObj = {
  //     mch_appid: this.ctx.app.config.wechatConfig.appid,
  //     mchid: this.ctx.app.config.wechatConfig.mchid,
  //     nonce_str: this.ctx.randomString(32),
  //     partner_trade_no,
  //     openid: user.OPENID,
  //     check_name: 'NO_CHECK',
  //     re_user_name: '',
  //     amount,
  //     desc,
  //     spbill_create_ip: ip,
  //   };
  //   const [ , signedStr ] = await getSign(inputObj);
  //   inputObj.sign = signedStr;
  //
  //   const builder = new xml2js.Builder({ headless: true, rootName: 'xml' });
  //   const xml = builder.buildObject(inputObj);
  //
  //   const appDir = path.resolve(process.cwd(), './');
  //   console.log(xml);
  //   const [ result ] = await this.ctx.helper.requestMethod(xml, 'POST',
  //     'https://api.mch.weixin.qq.com/mmpaymkttransfers/promotion/transfers',
  //     path.resolve(appDir + '//config/apiclient_cert.p12'), true);
  //   console.log(result);
  //   const parser = new xml2js.Parser({ explicitArray: false, explicitRoot: false });
  //   const withdrewResult = await parser.parseStringPromise(result);
  //   if (!this.isEmpty(withdrewResult) && withdrewResult.result_code !== 'FAIL') {
  //     const newMoney = Number(recentUserAccount.Bcoins) + amount;
  //     await this.dataIncrementRecord('提现',
  //       -amount * 100, 'bcoin', '提现');
  //     await this.setUserBcionChange(user.uuid, '提现',
  //       '消费', -amount * 100, newMoney);
  //   }
  //
  //
  //   const withDrewEntity = {
  //     guestIP: ip,
  //     desc,
  //     amount,
  //     OPENID: user.OPENID,
  //     partner_trade_no,
  //     nickName: user.nickName,
  //     userUUid: user.uuid,
  //     withdrewResult,
  //     return_msg: !this.isEmpty(withdrewResult.return_msg) ? withdrewResult.return_msg : '支付成功',
  //     result_code: withdrewResult.result_code,
  //   };
  //   const withDrewObj = new this.ctx.model.Withdrew(withDrewEntity);
  //   await withDrewObj.save();
  //   return withdrewResult;
  // }
  // ------------admin only----------------------
  async setGameEvent(condition) {
    if (condition.category === 'STEP1') {
      const systemSetting = await this.ctx.model.SystemSetting.findOne();
      condition.registerReward = systemSetting.registerMission.reward;
    }
    await this.ctx.model.GameEvent.updateOne({ category: condition.category },
      { $set: condition },
      { upsert: true });
  }

  async createEventGameSetting(condition) {
    const setter = condition;
    setter.uuid = uuid();
    setter.updated_at = new Date();
    if (condition.category === 'STEP1') {
      await this.ctx.model.GameEvent.updateOne({ category: condition.category }, {
        $set: { gameSetting: [ setter ] },
      }, { upsert: true });
    } else {
      await this.ctx.model.GameEvent.updateOne({ category: condition.category }, {
        $push: {
          gameSetting:
                        {
                          $each: [ setter ],
                          $sort: { updated_at: -1 },
                        },
        },
      }, { upsert: true });
    }

  }

  async updateEventGameSetting(condition) {
    condition.updated_at = new Date();
    await this.ctx.model.GameEvent.updateOne({
      category: condition.category,
      'gameSetting.uuid': condition.uuid,
    }, { $set: { 'gameSetting.$': condition } });

    if (condition.subsequent_A.available || condition.subsequent_B.available) {
      await this.ctx.model.GameProcess.updateMany({
        category: condition.category,
        status: '进行中',
        'content.uuid': condition.uuid,
      }, { $set: { 'content.$.done': false } });
    }

  }

  async getEventGameSettingList(condition, project = {}) {
    const gameEvent = await this.ctx.model.GameEvent.findOne({ category: condition.category },
      project);
    if (this.isEmpty(gameEvent)) {
      return [];
      // this.ctx.throw(400, '这个步骤没有设置游戏内容，请先去设置');
    }
    if (project.gameSetting === 0) {
      return gameEvent;
    }
    const auditUploadResult = await this.ctx.model.AuditUploadRecord.aggregate([
      { $match: { category: condition.category, status: 1 } },
      {
        $group: {

          _id: '$missionUUid',
          amount: { $sum: 1 },
        },
      },
    ]);


    const result = gameEvent;
    if (!this.isEmpty(gameEvent.gameSetting)) {
      result._doc.gameSetting = result.gameSetting.map(e => {
        const returnValue = e._doc;
        delete returnValue._id;
        delete returnValue.updated_at;
        return returnValue;
      });
    }
    const resultSetting = [];
    for (const element of result._doc.gameSetting) {
      let amount;
      const auditUploadElement = auditUploadResult.find(e => e._id === element.uuid);
      if (this.isEmpty(auditUploadElement)) {
        amount = 0;
      } else {
        amount = auditUploadElement.amount;
      }
      element.unCheckedAmount = amount;
      resultSetting.push(element);
    }
    return resultSetting;
  }

  async deleteEventGameSetting(condition) {
    await this.ctx.model.GameEvent.updateOne({ gameSetting: { $elemMatch: { uuid: condition.uuid } } },
      { $pull: { gameSetting: { uuid: condition.uuid } } });
  }


  async checkShareReward(userObj, setting) {
    const refUserID = userObj.referrer;

    if (refUserID) {
      const user_B = await this.ctx.model.UserAccount.findOne({ _id: refUserID }, { tel_number: 1, referrer: 1 });
      if (user_B && user_B.referrer) {
        const user_C = await this.ctx.model.UserAccount.findOne({ _id: user_B.referrer }, {
          tel_number: 1,
          uuid: 1,
        });
        if (!this.isEmpty(user_C)) {
          const hide1Process = await this.ctx.model.GameProcess.findOne({
            tel_number: user_C.tel_number,
            category: 'HIDE1',
          });
          const limitNumber = setting.limitNumber;
          const reward = setting.amount;
          if (hide1Process && hide1Process.currentIncoming >= limitNumber - 1) {
            await this.ctx.service.userService.modifyUserRcoin({
              tel_number: user_C.tel_number,
              amount: Number(reward),
              content: '活动奖励-邀请用户完成活动',
              type: '活动',
            });
            await this.ctx.model.GameProcess.deleteOne({
              tel_number: user_C.tel_number,
              category: 'HIDE1',
            });
          } else {
            await this.ctx.model.GameProcess.updateOne({
              tel_number: user_C.tel_number,
              category: 'HIDE1',
            }, {
              $set: {
                status: '其他',
                content: [],
                requiredIncoming: 5,
              },
              $inc: { currentIncoming: 1 },
            }, { upsert: true });
          }
        }
      }
    }

  }

  async approveAuditUploadRecord(condition) {
    const oldAuditUploadRecord = await this.ctx.model.AuditUploadRecord.findOne({ uuid: condition.uuid });

    if (this.isEmpty(oldAuditUploadRecord)) {
      this.ctx.throw(400, '找不到这个记录');
    }

    // if (oldAuditUploadRecord.status !== '未审核') {
    //   this.ctx.throw(400, '只有未审核状态的记录才能审批');
    // }
    const user = await this.ctx.model.UserAccount.findOne({ tel_number: oldAuditUploadRecord.tel_number });
    if (condition.decision) {

      const setter = {};
      setter[`content.$.complete_mission_${oldAuditUploadRecord.sub_title}`] = true;
      const gameEvent = await this.ctx.model.GameEvent.findOne({ category: oldAuditUploadRecord.category });
      if (oldAuditUploadRecord.category === 'STEP1') {
        setter['content.$.done'] = true;
        setter.status = '已完成';
        await this.ctx.service.wechatService.sendMessageCard(user.nickName,
          oldAuditUploadRecord.missionUUid, oldAuditUploadRecord.category,
          oldAuditUploadRecord.name, '通过', user.OPENID);
        await this.ctx.service.analyzeLogService.recordApproveChange({
          name: oldAuditUploadRecord.name,
          uuid: oldAuditUploadRecord.missionUUid,
          type: 'try',
        }, user);
      } else {

        const oldProcess = await this.ctx.model.GameProcess.findOne({
          category: oldAuditUploadRecord.category,
          tel_number: oldAuditUploadRecord.tel_number,
          'content.uuid': oldAuditUploadRecord.missionUUid,
        });

        const gameSetting = gameEvent.gameSetting.find(e => e.uuid === oldAuditUploadRecord.missionUUid);
        const gameProcess = oldProcess.content.find(e => e.uuid === oldAuditUploadRecord.missionUUid);
        if (!gameSetting.subsequent_A.available && !gameSetting.subsequent_B.available && oldAuditUploadRecord.sub_title === 'try') {
          setter['content.$.done'] = true;
        }
        if (gameProcess.complete_mission_try && gameProcess.complete_mission_B && oldAuditUploadRecord.sub_title === 'A') {
          setter['content.$.done'] = true;
        }
        if (gameProcess.complete_mission_try && gameProcess.complete_mission_A && oldAuditUploadRecord.sub_title === 'B') {
          setter['content.$.done'] = true;
        }


        await this.ctx.service.wechatService.sendMessageCard(user.nickName,
          oldAuditUploadRecord.missionUUid, oldAuditUploadRecord.category,
          oldAuditUploadRecord.name, '通过', user.OPENID);

      }

      const newGameProcess = await this.ctx.model.GameProcess.findOneAndUpdate({
        category: oldAuditUploadRecord.category,
        tel_number: oldAuditUploadRecord.tel_number,
        'content.uuid': oldAuditUploadRecord.missionUUid,
      },
      { $set: setter, $inc: { currentIncoming: oldAuditUploadRecord.increaseAmount } }, { new: true });

      const newContent = newGameProcess.content.find(e => e.done === false);
      if (this.isEmpty(newContent) || (newGameProcess.currentIncoming >= newGameProcess.requiredIncoming)) {
        const setting = await this.ctx.model.SystemSetting.findOne({}, {}, { sort: { created_at: -1 } });
        if (!this.isEmpty(setting.gameEventReward) && (oldAuditUploadRecord.category !== 'STEP1')) {
          const settingObj = setting.gameEventReward.find(element => {
            return element.category === oldAuditUploadRecord.category;
          });
          await this.checkShareReward(user, settingObj);
        }
        await this.ctx.model.GameProcess.updateOne({
          category: oldAuditUploadRecord.category,
          tel_number: oldAuditUploadRecord.tel_number,
          'content.uuid': oldAuditUploadRecord.missionUUid,
        },
        { $set: { status: '已完成' } });
      }

      await this.ctx.model.AuditUploadRecord.updateOne({ uuid: condition.uuid }, { $set: { status: '审核通过' } });
      await this.ctx.service.userService.modifyUserRcoin({
        tel_number: user.tel_number,
        amount: Number(oldAuditUploadRecord.increaseAmount),
        content: `活动奖励-${oldAuditUploadRecord.category}-${oldAuditUploadRecord.name}`,
        type: '活动',
      });
      await this.ctx.service.analyzeLogService.recordApproveChange({
        name: oldAuditUploadRecord.name,
        uuid: oldAuditUploadRecord.missionUUid,
        type: oldAuditUploadRecord.sub_title,
      }, user);

    } else {

      await this.ctx.service.wechatService.sendMessageCard(user.nickName,
        oldAuditUploadRecord.missionUUid, oldAuditUploadRecord.category,
        oldAuditUploadRecord.name, '不通过', user.OPENID);
      await this.ctx.model.AuditUploadRecord.updateOne({ uuid: condition.uuid }, { $set: { status: '审核未通过' } });
    }
  }

  async getAuditUploadRecordList(condition, option) {
    return this.ctx.model.AuditUploadRecord.find(condition, { _id: 0 }, option);
  }
}

module.exports = gameEventService;
