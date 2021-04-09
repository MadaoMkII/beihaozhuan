'use strict';
module.exports = app => {
  const mongoose = app.mongoose;
  // mongoose.set('useCreateIndex', true);
  // mongoose.set('useFindAndModify', false);
  const connection = app.mongooseDB.get('beihaozhuan');
  const structure = {
    userID: { type: app.mongoose.Schema.Types.ObjectId },
    missionID: { type: app.mongoose.Schema.Types.ObjectId },
    missionEventName: { type: String, required: true },
    recentAmount: { type: Number, default: 0 },
    requireAmount: { type: Number, default: 0 },
    completed: { type: Boolean, default: false },
    effectDay: { type: String, default: app.getFormatDate() },
  };
  const missionProcessingTracker = new mongoose.Schema(structure, {
    timestamps: {
      createdAt: 'created_at', updatedAt: 'updated_at',
    },
  });
  missionProcessingTracker.set('toJSON', {
    transform: (doc, ret) => {
      delete ret.__v;
      delete ret._id;
      delete ret.updated_at;
      ret.recentAmount = doc.recentAmount > doc.requireAmount ? doc.requireAmount : doc.recentAmount;
      // delete ret.password;
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
  return connection.model('DailyMissionProcessingTracker', missionProcessingTracker, 'DailyMissionProcessingTracker');
};
