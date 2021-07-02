'use strict';
module.exports = app => {
  const mongoose = app.mongoose;
  const connection = app.mongooseDB.get('beihaozhuan');
  const promotionBranch = new mongoose.Schema({
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
    stepNumber: {
      required: true,
      type: Number,
      default: 1,
    },
    branchTitle: { type: String, required: true },
    allowUpload: Boolean,
    rewardSwitch: { type: Boolean, required: true, default: false },
    promotionReward: {
      type: Number,
      min: [ 0, 'Must bigger than 0 ' ],
      default: 0,
    },
    description: String,
    showPics: {
      type: Array,
      default: [ 'https://beihaozhuan.oss-cn-zhangjiakou.aliyuncs.com/images/001.jpg',
        'https://beihaozhuan.oss-cn-zhangjiakou.aliyuncs.com/images/002.jpg',
        'https://beihaozhuan.oss-cn-zhangjiakou.aliyuncs.com/images/003.jpg' ],
    },
    downloadLink: { type: String, required: false },
    status: {
      required: true,
      type: String,
      enum: [ 'enable', 'disable' ], default: 'disable',
    },
    finishCount: { type: Number, default: 0 },
  }, {
    timestamps: {
      createdAt: 'created_at', updatedAt: 'updated_at',
    },
  });

  promotionBranch.virtual('category', {
    ref: 'Category', // The model to use
    localField: 'categoryUUid', // Find people where `localField`
    foreignField: 'uuid', // is equal to `foreignField`
    justOne: true,
  });
  promotionBranch.set('toJSON', {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret.id;
      delete ret.__v;
      delete ret._id;
      ret.category = doc.category ? doc.category.category : '未分类';
    },
  });

  return connection.model('PromotionBranch', promotionBranch, 'PromotionBranch');
};
