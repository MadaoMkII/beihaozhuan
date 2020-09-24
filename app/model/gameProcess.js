'use strict';
module.exports = app => {
  const mongoose = app.mongoose;
  const connection = app.mongooseDB.get('beihaozhuan');
  const gameProcess = new mongoose.Schema({
    tel_number: {
      required: true,
      type: String,
    },
    category: { // 复合KEY
      required: true,
      type: String,
    },
    status: { required: true, type: String, enum: [ '未开始', '进行中', '已完成', '其他' ] },
    content: [
      {
        uuid: String,
        done: Boolean,
        gameName: String,
        platform: String,
        gameSketchUrl: String,

        hasDownloaded: Boolean, // 是否下载过

        complete_mission_try: Boolean,
        amount_mission_try: Number,

        complete_mission_A: Boolean,
        amount_mission_A: Number,

        complete_mission_B: Boolean,
        amount_mission_B: Number,
      },
    ],
    complete_mission_watchVideo: Boolean,
    amount_mission_watchVideo: Number,
    currentIncoming: { type: Number, default: 0 },
    requiredIncoming: { type: Number, default: 0 },
    hasWithdrew: { type: Boolean, default: false },
  },
  {
    timestamps: {
      createdAt: 'created_at', updatedAt: 'updated_at',
    },
  });
  gameProcess.set('toJSON', {
    transform: (origin, show) => {
      delete show.__v;
      delete show._id;
      delete show.updated_at;
      delete show.created_at;
      // show.created_at = app.getLocalTime(origin.created_at);
    },
  });
  return connection.model('GameProcess', gameProcess, 'GameProcess');
};
