'use strict';
const Subscription = require('egg').Subscription;
const { DateTime } = require('luxon');
class UpdateCache extends Subscription {
  // 通过 schedule 属性来设置定时任务的执行间隔等配置
  static get schedule() {
    return {
      immediate: true,
      interval: '15s', // 1 分钟间隔
      type: 'worker', // 指定所有的 worker 都需要执行
    };
  }

  // subscribe 是真正定时任务执行时被运行的函数
  async subscribe() {
    const scheduleTasks = await this.ctx.model.ScheduleTask.find({});
    // DateTime.local(2020, 7, 2, 7, 59, 55);
    for (const element of scheduleTasks) {
      switch (element.appAgentName) {
        case 'opinionSuggestion':
          await this.delayDownloadFile(element);
          break;

        case 'evaluation':
          await this.sendEvaluationMessage(element);
          break;

        case 'malfunctionReporting':
          await this.sendMalfunctionReportingMessage(element);
          break;


        default:
          break;
      }


    }
  }
  async sendMalfunctionReportingMessage(element) {
    try {
      const nowDate = DateTime.fromJSDate(new Date());
      const triggerDate = DateTime.fromJSDate(element.triggerDate);
      const diffTime = nowDate.diff(triggerDate, 'minutes').minutes;
      console.log(diffTime);
      if (diffTime > 2) {
        const message = {};
        message.content = '您有工单已超时尚未处理，请尽快处理！';
        message.title = '报修工单需要处理';
        message.url = `${this.ctx.app.config.domain.host}/malfunctionReporting/tickets/${element.evaluationMissionUUID}`;
        await this.ctx.service.systemSettingService.sendMessage(element.receivers, message, 'malfunctionReporting');
        await this.ctx.model.ScheduleTask.deleteOne({ _id: element._id });
      }
    } catch (e) {
      console.log(e);
    }
  }
  async delayDownloadFile(element) {
    try {
      const fileName = this.ctx.randomString(8);
      const token = await this.ctx.service.systemSettingService.getAndUpdateToken(element.appAgentName);
      const url = `https://qyapi.weixin.qq.com/cgi-bin/media/get?access_token=${token}&media_id=${element.url}`;
      const fileFinalName = await this.ctx.service.fileService.download(url, fileName);
      if (!element.nest) {
        await this.ctx.model.OpinionSuggestion.updateOne({ uuid: element.evaluationMissionUUID },
          { $set: { 'accessory.localMediaId': fileFinalName }, $unset: { 'accessory.mediaId': '' } });
      } else {
        await this.ctx.model.OpinionSuggestion.findOneAndUpdate({ uuid: element.evaluationMissionUUID,
          'operationHistory.detail.accessory.mediaId': element.url },
        { $set: { 'operationHistory.$.detail.accessory.localMediaId': fileFinalName },
          $unset: { 'operationHistory.$.detail.accessory.mediaId': '' } });
      }
      await this.ctx.model.ScheduleTask.deleteOne({ _id: element._id });
    } catch (e) {
      console.log(e);
      if (e.toString().includes('invalid media_id')) {
        await this.ctx.model.ScheduleTask.deleteOne({ _id: element._id });
        // TODO 这里得加个报错日志
      }
    }

  }
  async sendEvaluationMessage(element) {
    const nowDate = DateTime.fromJSDate(new Date());
    const triggerDate = DateTime.fromJSDate(element.triggerDate);
    const diffTime = triggerDate.diff(nowDate, 'minutes');
    if (diffTime.minutes <= 0 || Math.abs(diffTime.minutes) <= 1) { //
      const message = {};
      switch (element.category) {
        case 'end':
          message.content = `您负责的评价【${element.title}】将于30分钟内结束，请注意查看！\n`;
          message.url = `${this.ctx.app.config.domain.host}/evaluation/results/${element.evaluationMissionUUID}`;
          message.title = `您负责的评价【${element.title}】将于30分钟内结束`;
          break;
        case 'begin':
          message.content = `您负责的评价【${element.title}】将于30分钟内开始，请注意查看！\n`;
          message.url = `${this.ctx.app.config.domain.host}/evaluation/results/${element.evaluationMissionUUID}`;
          message.title = `您负责的评价【${element.title}】将于30分钟内开始`;
          break;
        default:
          break;
      }
      if (!this.app.isEmpty(element.receivers)) {
        // const agentId = await this.getAgentIdByAgentName('evaluation');
        await this.ctx.service.systemSettingService.sendMessage(element.receivers, message, 'evaluation');

      }
      await this.ctx.model.ScheduleTask.deleteOne({ _id: element._id });
    }
  }
}

module.exports = UpdateCache;
