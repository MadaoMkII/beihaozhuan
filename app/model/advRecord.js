'use strict';
module.exports = app => {
  const mongoose = app.mongoose;
  const connection = app.mongooseDB.get('analyze');
  const advRecord = new mongoose.Schema({
    userID: {
      required: true,
      type: app.mongoose.Schema.Types.ObjectId,
    },
    advertisementID: {
      required: true,
      type: app.mongoose.Schema.Types.ObjectId,
    },
    absoluteDate: Date,
    amount: Number,
    type: String,

  }, {
    timestamps: {
      createdAt: 'created_at', updatedAt: 'updated_at',
    },
  });

  advRecord.set('toJSON', {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret.__v;
      delete ret._id;
      delete ret.id;
      if (typeof doc.advertisementID === 'object' && doc.advertisementID.reward) {
        ret.totalReword = doc.advertisementID.reward * doc.amount;
        ret.RMBReword = doc.advertisementID.reward * doc.amount / 100;
        delete doc.advertisementID.reward;
        ret.advertisement = doc.advertisementID;
        delete ret.advertisementID;
      }
      if (typeof doc.userID === 'object') {
        ret.user = doc.userID;
        delete ret.userID;
      }

      if (doc.updated_at) {
        ret.updated_at = app.getFormatDateForJSON(doc.updated_at);
      }
      if (doc.created_at) {
        ret.created_at = app.getFormatDateForJSON(doc.created_at);
      }
    },
  });
  advRecord.set('toObject', {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret.__v;
    },
  });
  return connection.model('AdvRecord', advRecord, 'AdvRecord');
};
