'use strict';
module.exports = app => {
  const mongoose = app.mongoose;
  const connection = app.mongooseDB.get('beihaozhuan');
  const localCtx = app.createAnonymousContext();
  const userPromotion = new mongoose.Schema({
    uuid: {
      required: true,
      type: String,
      unique: true,
      sparse: true,
    },
    promotionUUid: {
      required: true,
      type: String,
    },
    promotionBranchUUid: {
      required: true,
      type: String,
    },
    stepNumber: {
      required: true,
      type: Number,
      default: 1,
    },
    tel_number: {
      required: true,
      type: String,
    },
    nickName: String,
    status: { required: true,
      type: Number,
      get: localCtx.helper.exchangeRating,
      set: localCtx.helper.exchangeRating },
    screenshotUrls: [ String ],
    title: String,
    reward: {
      default: 0,
      type: Number,
      min: [ 0, 'Must bigger than 0 ' ],
      // max: 1000,
    },
    operator: { nickName: String, tel_number: String },
    creator: { nickName: String, tel_number: String },
    source: String,
  },
  {
    timestamps: {
      createdAt: 'created_at', updatedAt: 'updated_at',
    },
  });
  userPromotion.virtual('promotionBranchObj', {
    ref: 'PromotionBranch', // The model to use
    localField: 'promotionBranchUUid', // Find people where `localField`
    foreignField: 'uuid', // is equal to `foreignField`
    justOne: true,
  });
  userPromotion.set('toObject', {
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
  userPromotion.set('toJSON', {
    setters: true,
    getters: true,
    transform: (origin, show) => {
      delete show._id;
      delete show.__v;
      delete show.id;
      if (origin.created_at) {
        show.created_at = app.getLocalTime(origin.created_at);
      }
      if (origin.updated_at) {
        show.updated_at = app.getLocalTime(origin.updated_at);
      }
    },
  });
  return connection.model('UserPromotion', userPromotion, 'UserPromotion');
};
