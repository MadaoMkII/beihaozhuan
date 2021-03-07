'use strict';
module.exports = app => {
  const mongoose = app.mongoose;
  const connection = app.mongooseDB.get('beihaozhuan');
  const promotion = new mongoose.Schema({
    uuid: {
      required: true,
      type: String,
      unique: true,
      sparse: true,
    },
    title: { type: String, required: true },
    categoryUUid: { type: String, required: true },
    promotionType: {
      required: true,
      type: String,
      enum: [ '普通试玩', '时长试玩' ],
    },
    platform: {
      required: true,
      type: String,
      enum: [ 'H5-Android', 'H5-IOS', 'APP-Android', 'APP-IOS' ],
    },
    description: String,
    reward: {
      type: Number,
      min: [ 0, 'Must bigger than 0 ' ],
      // max: 1000,
    },
    priority: Number,
    status: {
      required: true,
      type: String,
      enum: [ 'enable', 'disable' ], default: 'disable',
    },
    mainlyShowPicUrl: {
      type: String,
      default: 'https://beihaozhuan.oss-cn-zhangjiakou.aliyuncs.com/UI/QQ%E6%88%AA%E5%9B%BE20190827233433.png',
    },
    stepsBox: [{ uuid: String, stepNumber: Number }],
  }, {
    timestamps: {
      createdAt: 'created_at', updatedAt: 'updated_at',
    },
  });

  promotion.virtual('category', {
    ref: 'Category', // The model to use
    localField: 'categoryUUid', // Find people where `localField`
    foreignField: 'uuid', // is equal to `foreignField`
    justOne: true,
  });
  promotion.set('toObject', {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret.id;
      delete ret.__v;
      delete ret._id;
      ret.category = doc.category ? doc.category.category : '未分类';
    },
  });
  promotion.set('toJSON', {
    virtuals: true,
    transform: (origin, show) => {
      delete show.id;
      delete show.__v;
      delete show._id;
      show.category = origin.category ? origin.category.category : '未分类';
      if (origin.created_at) {
        show.created_at = app.getLocalTime(origin.created_at);
      }
      if (origin.updated_at) {
        show.updated_at = app.getLocalTime(origin.updated_at);
      }
    },
  });

  return connection.model('Promotion', promotion, 'Promotion');
};
