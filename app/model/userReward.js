'use strict';
module.exports = app => {
  const mongoose = app.mongoose;
  const connection = app.mongooseDB.get('beihaozhuan');
  const userReward = new mongoose.Schema({
    uuid: {
      required: true,
      type: String,
      unique: true,
      sparse: true,
    },
    status: {
      required: true,
      type: String,
      enum: [ '开启', '关闭' ],
    },
    title: String,
    singleReward: { required: true, type: Number, default: 0 },
    guests: [{ tel_number: String, nickName: String }],
    numberOfPeople: { required: true, type: Number, default: 0 },
    totalAmount: { required: true, type: Number, default: 0 },
    operator: { tel_number: String, nickName: String },
  },
  {
    timestamps: {
      createdAt: 'created_at', updatedAt: 'updated_at',
    },
  });
  userReward.set('toJSON', {
    transform: (origin, show) => {
      delete show.__v;
      delete show._id;
      delete show.id;
      if (origin.created_at) { show.created_at = app.getLocalTime(origin.created_at); }
      if (origin.updated_at) { show.updated_at = app.getLocalTime(origin.updated_at); }
      if (origin.guests) {
        show.guests = origin.guests.map(e => { return { tel_number: e.tel_number, nickName: e.nickName }; });
      }
    },
  });
  return connection.model('UserReward', userReward, 'UserReward');
};
