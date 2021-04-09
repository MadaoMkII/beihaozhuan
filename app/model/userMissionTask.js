'use strict';
module.exports = app => {
  const mongoose = app.mongoose;
  const connection = app.mongooseDB.get('beihaozhuan');
  const userMissionTask = new mongoose.Schema({
    uuid: {
      required: true,
      type: String,
      unique: true,
      sparse: true,
    },
    tel_number: String,
    nickName: String,
    title: { type: String, required: true },
    missionUUid: { type: String, required: true },
    picUrl: { type: String, required: true },
    type: {
      required: true,
      type: String,
      enum: [ '签到任务', '新闻时长任务', '新闻数量任务', '小视频时长任务', '小视频数量任务' ] },


    reward: { type: Number, default: 0 },

    requireTimes: { type: Number, default: 0 },
    recentTimes: { type: Number, default: 0 },

    limit: { type: Number, default: 1 },
    finishedTimes: { type: Number, default: 0 },
    status: {
      required: true,
      type: String,
      enum: [ '完成', '过期', '进行中', '等待领取', '阶段完成' ], default: '进行中',
    },
  }, {
    timestamps: {
      createdAt: 'created_at', updatedAt: 'updated_at',
    },
  });

  userMissionTask.set('toObject', {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret.id;
      delete ret.__v;
      delete ret._id;
    },
  });
  userMissionTask.set('toJSON', {
    virtuals: true,
    transform: (origin, show) => {
      delete show.id;
      delete show.__v;
      delete show._id;
      if (origin.created_at) {
        show.created_at = app.getLocalTime(origin.created_at);
      }
      if (origin.updated_at) {
        show.updated_at = app.getLocalTime(origin.updated_at);
      }
    },
  });

  return connection.model('UserMissionTask', userMissionTask, 'UserMissionTask');
};
