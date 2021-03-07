'use strict';
module.exports = app => {
  const mongoose = app.mongoose;
  const connection = app.mongooseDB.get('beihaozhuan');
  const category = new mongoose.Schema({
    uuid: {
      required: true,
      type: String,
      unique: true,
      sparse: true,
    },
    category: {
      required: true,
      type: String,
    },
    priority: Number,
    amount: { type: Number, default: 0 },
    type: {
      required: true,
      type: String,
      enum: [ '商品', '试玩' ], default: '商品' },
  },
  {
    timestamps: {
      createdAt: 'created_at', updatedAt: 'updated_at',
    },
  });
  category.set('toJSON', {
    transform: (origin, show) => {
      delete show.__v;
      delete show._id;
      delete show.id;
      delete show.updated_at;
      delete show.created_at;
      show.updated_at = app.getLocalTime(origin.updated_at);
    },
  });
  return connection.model('Category', category, 'Category');
};
