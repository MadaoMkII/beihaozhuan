'use strict';
module.exports = app => {
  const mongoose = app.mongoose;
  const connection = app.mongooseDB.get('beihaozhuan');
  const realMission = new mongoose.Schema({
    uuid: {
      required: true,
      type: String,
      unique: true,
      sparse: true,
    },
    title: { type: String, required: true },
    type: {
      required: true,
      type: String,
      enum: [ '签到任务', '新闻时长任务', '新闻数量任务', '小视频时长任务', '小视频数量任务' ] },
    reward: { type: Number, default: 0 },

    requireTimes: { type: Number, default: 0 },

    limit: { type: Number, default: 1 },

    picUrl: String,


    totalFinishAmount: { type: Number, default: 0 }, // 总完成次数

    extraSwitch: { type: Boolean, default: false },
    extraBonusAmount: { type: Number, default: 0 },
    extraBonusRate: { type: Number, default: 1, min: 1 },
    status: {
      required: true,
      type: String,
      enum: [ 'enable', 'disable' ], default: 'disable',
    },
  }, {
    timestamps: {
      createdAt: 'created_at', updatedAt: 'updated_at',
    },
  });
  realMission.set('toJSON', {
    transform: (doc, ret) => {
      delete ret.__v;
      delete ret._id;
      delete ret.updated_at;
      ret.created_at = app.getLocalTime(doc.created_at);
      ret.recentAmount = doc.recentAmount > doc.requireAmount ? doc.requireAmount : doc.recentAmount;
    },
  });
  return connection.model('RealMission', realMission, 'RealMission');
};
