'use strict';
module.exports = app => {
  const mongoose = app.mongoose;
  const connection = app.mongooseDB.get('beihaozhuan');
  const withdrewConstraint = new mongoose.Schema({
    status: { enum: [ 'enable', 'disable' ], default: 'enable', type: String },
    title: String,
    amount: { type: Number, min: 1 },
    period: String,
    withdrewConstraintTimes: Number,
    onlyOneTime: Boolean,
    description: String,
  }, {
    timestamps: {
      createdAt: 'created_at', updatedAt: 'updated_at',
    },
  });

  withdrewConstraint.set('toJSON', {
    transform: (doc, ret) => {
      delete ret.__v;
      ret.id = doc._id;
      delete ret._id;
      if (doc.created_at) {
        ret.created_at = app.getLocalTime(doc.created_at);
      }
      delete ret.updated_at;
    },
  });

  return connection.model('WithdrewConstraint', withdrewConstraint, 'WithdrewConstraint');
};
