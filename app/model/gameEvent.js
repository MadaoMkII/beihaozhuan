'use strict';
module.exports = app => {
  const mongoose = app.mongoose;
  const connection = app.mongooseDB.get('beihaozhuan');
  const gameEvent = new mongoose.Schema({
    category: {
      required: true,
      type: String,
      enum: [ 'STEP1', 'STEP2', 'STEP3', 'STEP4', 'STEP5', 'STEP6' ],
      unique: true,
      sparse: true,
    },
    description_short: String,
    expectEarning: { required: true, type: Number, default: 0 },
    videoTutorialUrl: String,
    firstWatchEarning: { required: true, type: Number, default: 0 },
    registerReward: Number, // 只有第一部有
    gameSetting: [
      {
        uuid: String,
        gameName: { // 游戏名称
          required: true,
          type: String,
        },
        platform: { required: true, type: String, enum: [ '安卓', 'IOS', '通用' ] },
        gameBannerUrl: String,
        downloadUrl: String,
        demoDescription: String,
        demoReward: { required: true, type: Number, default: 0 },
        demoSketchUrl: String,

        updated_at: Date,

        subsequent_A: {
          subsequentReward: Number,
          available: { required: true, type: Boolean, default: false },
          subsequentDescription: String,
          subsequentSketchUrl: String,
        },
        subsequent_B: {
          subsequentReward: Number,
          available: { required: true, type: Boolean, default: false },
          subsequentDescription: String,
          subsequentSketchUrl: String,
        },
      },
    ],
  },
  {
    timestamps: {
      createdAt: 'created_at', updatedAt: 'updated_at',
    },
  });
  gameEvent.set('toJSON', {
    transform: (origin, show) => {
      delete show.__v;
      delete show._id;
      delete show.id;
      delete show.updated_at;
      delete show.created_at;
      // show.created_at = app.getLocalTime(origin.created_at);
    },
  });
  return connection.model('GameEvent', gameEvent, 'GameEvent');
};
