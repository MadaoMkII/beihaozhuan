'use strict';
const autoPopulate = require('mongoose-autopopulate');
module.exports = app => {
  const mongoose = app.mongoose;
  const connection = app.mongooseDB.get('beihaozhuan');
  const orderTrack = mongoose.Schema(
    {
      title: String,
      good_id: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Good',
        // autopopulate: { select: 'nickName avatar USERID jobNumber' },
      },
      content: String,
      price: String,
      mainlyShowPicUrl: String,
      creator: {
        type: mongoose.Schema.Types.ObjectId, ref: 'RealMission',
        autopopulate: { select: 'uuid title tel_number' },
      },
      tel_number: String,
    },
    {
      timestamps: {
        createdAt: 'created_at', updatedAt: 'updated_at',
      },
    });

  orderTrack.set('toJSON', {
    transform: (doc, ret) => {
      delete ret.__v;
      delete ret._id;
      delete ret.updated_at;
      if (doc._id) { ret.id = doc._id; }
      ret.created_at = app.getLocalTime(doc.created_at);
    },
  });
  orderTrack.plugin(autoPopulate);
  return connection.model('OrderTrack', orderTrack, 'OrderTrack');
};
