'use strict';
module.exports = app => {
  const mongoose = app.mongoose;
  const connection = app.mongooseDB.get('beihaozhuan');
  const localCtx = app.createAnonymousContext();
  const auditUploadRecord = new mongoose.Schema({
    uuid: {
      required: true,
      type: String,
      unique: true,
      sparse: true,
    },
    category: {
      required: true,
      type: String,
      enum: [ 'STEP1', 'STEP2', 'STEP3', 'STEP4', 'STEP5', 'STEP6' ],
    },
    missionUUid: {
      required: true,
      type: String,
    },
    sub_title: String,
    increaseAmount: Number,
    tel_number: {
      required: true,
      type: String,
    },
    hasDownloaded: Boolean,
    name: String,
    status: { required: true,
      type: Number,
      get: localCtx.helper.exchangeRating,
      set: localCtx.helper.exchangeRating },
    screenshotUrl: String,
  },
  {
    timestamps: {
      createdAt: 'created_at', updatedAt: 'updated_at',
    },
  });
  auditUploadRecord.set('toObject', {
    setters: true,
    transform: (origin, show) => {
      delete show.__v;
      delete show._id;
      delete show.id;
      delete show.updated_at;
      show.created_at = app.getLocalTime(origin.created_at);
    },
  });

  auditUploadRecord.set('toJSON', {
    setters: true,
    getters: true,
    transform: (origin, show) => {
      delete show.__v;
      delete show._id;
      delete show.id;
      delete show.updated_at;
      show.created_at = app.getLocalTime(origin.created_at);
    },
  });
  return connection.model('AuditUploadRecord', auditUploadRecord, 'AuditUploadRecord');
};
