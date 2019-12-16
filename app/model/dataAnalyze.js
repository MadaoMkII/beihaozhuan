'use strict';
module.exports = app => {
  const mongoose = app.mongoose;
  const connection = app.mongooseDB.get('analyze');
  const analyzeData = new mongoose.Schema({
    absoluteDate: Date,
    amount: Number,
    content: {
      type: String,
    },
    type: String, category:String
  }, {
    timestamps: {
      createdAt: 'created_at', updatedAt: 'updated_at',
    },
  });

  analyzeData.set('toJSON', {
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
  analyzeData.set('toObject', {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret.__v;
    },
  });

  return connection.model('AnalyzeData', analyzeData, 'AnalyzeData');
};
