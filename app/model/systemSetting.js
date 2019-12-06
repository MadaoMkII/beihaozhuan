'use strict';
module.exports = app => {
  const mongoose = app.mongoose;
  // mongoose.set('useCreateIndex', true);
  // mongoose.set('useFindAndModify', false);
  const connection = app.mongooseDB.get('commonConnection');
  const systemSetting = new mongoose.Schema({
    registerMission: {
      activity: {
        type: String,
        enum: [ 'enable', 'disable' ], default: 'disable',
      },
      reward: Number,
    },
    // inviteMission: {
    //     numberOfInvite: Number,
    //     activity: {
    //         type: String,
    //         enum: ['enable', 'disable'], default: "disable"
    //     }, reward: Number
    // },
    weighting: Number,
    serviceNumber: { default: '405-123-4568', type: String },
    recommendGood: { type: mongoose.Schema.Types.ObjectId },
    advertisementSetting: { type: mongoose.Schema.Types.Mixed },
    token: { type: mongoose.Schema.Types.Mixed },
    withDrewSetting: [{
      category: String,
      amount: String,
      desc: String,
      optionType: String,
    }],
  }, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  });
  systemSetting.set('toObject', {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret.__v;
      delete ret._id;
      delete ret.id;
      // delete ret.password;
      // ret.Bcoins = doc.Bcoins;
      // ret.VIPLevel = vipCoculart(doc.growthPoints);
      // if (doc.created_at && doc.updated_at) {
      //     ret.created_at = new Date(doc.created_at).getTime();
      //     ret.updated_at = new Date(doc.updated_at).getTime();
      // }
      // if (doc.last_login_time) {
      //     ret.last_login_time = new Date(doc.last_login_time).getTime();
      // }
    },
  });
  systemSetting.set('toJSON', {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret.__v;
      delete ret._id;
      delete ret.id;
      delete ret.password;
      delete ret.updated_at;
      delete ret.create_at;
      // ret.Bcoins = doc.Bcoins;
      // if (doc.created_at && doc.updated_at) {
      //     ret.created_at = new Date(doc.created_at).getTime();
      //     ret.updated_at = new Date(doc.updated_at).getTime();
      // }
      // if (doc.last_login_time) {
      //     ret.last_login_time = new Date(doc.last_login_time).getTime();
      // }
    },
  });
  return connection.model('SystemSetting', systemSetting, 'SystemSetting');
};

