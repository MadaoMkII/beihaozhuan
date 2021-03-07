'use strict';
module.exports = app => {
  const mongoose = app.mongoose;
  const connection = app.mongooseDB.get('beihaozhuan');
  const goodSchema = new mongoose.Schema({
    uuid: {
      required: true,
      type: String,
      unique: true,
      sparse: true,
    },
    title: { type: String, required: true },
    categoryUUid: { type: String, required: true },
    slideShowPicUrlArray: {
      type: Array,
      default: [ 'https://beihaozhuan.oss-cn-zhangjiakou.aliyuncs.com/images/001.jpg',
        'https://beihaozhuan.oss-cn-zhangjiakou.aliyuncs.com/images/002.jpg',
        'https://beihaozhuan.oss-cn-zhangjiakou.aliyuncs.com/images/003.jpg' ],
    },
    price: {
      type: Number,
      min: [ 0, 'Must bigger than 0 ' ],
    },
    description: String,
    inventory: {
      type: Number,
      min: [ 0, 'Must bigger than 0 ' ],
      max: 1000,
    },
    mainlyShowPicUrl: {
      type: String,
      default: 'https://beihaozhuan.oss-cn-zhangjiakou.aliyuncs.com/UI/QQ%E6%88%AA%E5%9B%BE20190827233433.png',
    },
    status: {
      required: true,
      type: String,
      enum: [ 'enable', 'disable' ], default: 'disable',
    },
    exchangeWay: {
      required: true,
      type: String,
      enum: [ 'link', 'pic&word' ], default: 'link',
    },
    paymentMethod: {
      required: true,
      type: String,
      enum: [ 'Bcoin', 'Money' ], default: 'Money',
    },
    giftExchangeContent: String,
    isRecommend: { type: Boolean, default: false },
    redeemCode: String,
  }, {
    timestamps: {
      createdAt: 'created_at', updatedAt: 'updated_at',
    },
  });

  goodSchema.virtual('category', {
    ref: 'Category', // The model to use
    localField: 'categoryUUid', // Find people where `localField`
    foreignField: 'uuid', // is equal to `foreignField`
    justOne: true,
    // options: { sort: { name: -1 }, limit: 5 }, // Query options, see http://bit.ly/mongoose-query-options
  });
  goodSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret.__v;
      delete ret._id;
      delete ret.id;
      delete ret.created_at;
      delete ret.updated_at;
      ret.category = doc.category ? doc.category.category : '未分类';
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

  return connection.model('Good', goodSchema, 'Good');
};
