'use strict';
module.exports = app => {
  const mongoose = app.mongoose;
  const connection = app.mongooseDB.get('analyze');
  const goodSchema = new mongoose.Schema({
    guestIP: String,
    desc: String,
    amount: Number,
    OPENID: String,
    partner_trade_no: String,
    nickName: String,
    userUUid: String,
    withdrewResult: { type: mongoose.Schema.Types.Mixed },
    return_msg: String,
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
      delete ret._id;
      delete ret.id;
      delete ret.created_at;
      delete ret.updated_at;
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

  return connection.model('Withdrew', goodSchema, 'Withdrew');
};
