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
    result_code: String,
  }, {
    timestamps: {
      createdAt: 'created_at', updatedAt: 'updated_at', toObject: { virtuals: true },
      toJSON: { virtuals: true },
    },
  });

  goodSchema.set('toObject', {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret.__v;
      delete ret.id;
      if (doc.created_at) {
        ret.created_at = app.getLocalTime(doc.created_at);
      }
    },
  });
  goodSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret.__v;
      delete ret._id;
      delete ret.id;
      if (doc.created_at) {
        ret.created_at = app.getLocalTime(doc.created_at);
      }
      delete ret.updated_at;
    },
  });

  return connection.model('Withdrew', goodSchema, 'Withdrew');
};
