'use strict';
module.exports = app => {
  const mongoose = app.mongoose;
  const connection = app.mongooseDB.get('promotionConnection');
  const goodSchema = new mongoose.Schema({
    account: { type: String, required: true },
    tel_number_verify: { type: String, required: true },
    // featuredFirst: {type: String, required: true, default: "mainPage"},
    loginPicUrl: String,
    registerPicUrl: String,
    bindingPicUrl: String,
    userUUid: { type: String, required: true },
    status: { type: String, enum: [ '未审核', '审核通过', '审核不通过' ], default: '未审核' },
  }, {
    timestamps: {
      createdAt: 'created_at', updatedAt: 'updated_at', toObject: { virtuals: true },
      toJSON: { virtuals: true },
    },
  });

  // goodSchema.set('toObject', {
  //     virtuals: true,
  //     transform: (doc, ret) => {
  //         delete ret.__v;
  //         delete ret._id;
  //         delete ret.id;
  //         delete ret.password;
  //         ret.Bcoins = doc.Bcoins;
  //         // ret.VIPLevel = vipCoculart(doc.growthPoints);
  //         // if (doc.created_at && doc.updated_at) {
  //         //     ret.created_at = new Date(doc.created_at).getTime();
  //         //     ret.updated_at = new Date(doc.updated_at).getTime();
  //         // }
  //         // if (doc.last_login_time) {
  //         //     ret.last_login_time = new Date(doc.last_login_time).getTime();
  //         // }
  //     }
  // });
  goodSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret.__v;
      delete ret.id;
      delete ret.created_at;
      delete ret.updated_at;
      if (doc.created_at) {
        ret.created_at = app.getLocalTime(doc.created_at);
      }
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

  return connection.model('DoubleDec', goodSchema, 'DoubleDec');
};
