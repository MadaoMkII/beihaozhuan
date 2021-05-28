'use strict';
module.exports = app => {
  const mongoose = app.mongoose;
  const connection = app.mongooseDB.get('beihaozhuan');
  const withdrew = new mongoose.Schema({
    category: String,
    guestIP: String,
    desc: String,
    amount: Number,
    OPENID: String,
    partner_trade_no: String,
    nickName: String,
    tel_number: String,
    source: String,
    userUUid: String,
    constraint_id: { type: mongoose.Schema.Types.ObjectId,
      ref: 'WithdrewConstraint',
      autopopulate: true },
    withdrewResult: { type: mongoose.Schema.Types.Mixed },
    return_msg: String,
    result_code: String,
  }, {
    timestamps: {
      createdAt: 'created_at', updatedAt: 'updated_at', toObject: { virtuals: true },
      toJSON: { virtuals: true },
    },
  });

  withdrew.set('toObject', {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret.__v;
      delete ret.id;
      if (doc.created_at) {
        ret.created_at = app.getLocalTime(doc.created_at);
      }
    },
  });
  withdrew.set('toJSON', {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret.__v;
      delete ret._id;
      delete ret.id;
      if (doc.created_at) {
        ret.created_at = app.getLocalTime(doc.created_at);
      }
      doc.amount = ret.amount / 100;
      delete ret.updated_at;
    },
  });
  withdrew.plugin(require('mongoose-autopopulate'));
  return connection.model('Withdrew', withdrew, 'Withdrew');
};
