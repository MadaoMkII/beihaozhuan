module.exports = app => {
  const mongoose = app.mongoose;
  const connection = app.mongooseDB.get('userConnection');
  const userAccountSchema = new mongoose.Schema({
    uuid: {
      required: true,
      type: String,
      unique: true,
      sparse: true,
    },
    password: {
      required: true,
      type: String,
    },
    role: String,
    tel_number: {
      required: true,
      type: String,
      unique: true,
      sparse: true,
    },
    lottery: Number,
    lastSignInDay: String,
    signTimes: Number,
    last_login_time: Date,
  }, {
    timestamps: {
      createdAt: 'created_at', updatedAt: 'updated_at',
    },
  });

  userAccountSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret.__v;
      delete ret._id;
      delete ret.id;
      delete ret.password;
      // if (doc.updated_at) {
      //     ret.updated_at = app.getFormatDateForJSON(doc.updated_at);
      // }
      // if (doc.created_at) {
      //     ret.created_at = app.getFormatDateForJSON(doc.created_at);
      // }
    },
  });
  userAccountSchema.set('toObject', {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret.__v;
      // delete ret._id;
      // delete ret.password;
    },
  });

  return connection.model('UserAccountFake', userAccountSchema, 'UserAccountFake');
};
