'use strict';
module.exports = app => {
  const mongoose = app.mongoose;
  const connection = app.mongooseDB.get('beihaozhuan');
  const analyzeLog = new mongoose.Schema({
    analyzeDate: Date,
    amount: Number,
    amount_1: Number,
    amount_2: Number,
    totalAmount: Number,
    tel_number: String,
    nickName: String,
    category: String,
    category_3: String,
    category_2: String,
    category_1: String,
    dataArray: [{ type: mongoose.Schema.Types.Mixed }],
    type: String,
    date_1: Date,
  }, {
    timestamps: {
      createdAt: 'created_at', updatedAt: 'updated_at',
    },
  });

  analyzeLog.set('toJSON', {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret.__v;

      delete ret._id;
      delete ret.id;
      delete ret.password;
      if (doc.updated_at) {
        ret.updated_at = app.getFormatDateForJSON(doc.updated_at);
      }
      if (doc.created_at) {
        ret.created_at = app.getFormatDateForJSON(doc.created_at);
      }
    },
  });
  analyzeLog.set('toObject', {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret.__v;
    },
  });

  return connection.model('AnalyzeLog', analyzeLog, 'AnalyzeLog');
};
