
module.exports = app => {
    const mongoose = app.mongoose;
    mongoose.set('useCreateIndex', true);

    let userAccountSchema = new mongoose.Schema({
        uuid: {
            required: true,
            type: String,
            unique: true
        },
        password: {
            required: true,
            type: String
        },
        role: String,
        userStatus: {
            hasPaid: {type: Boolean, default: false}
        },
        tel_number: {
            required: true,
            type: String,
            unique: true
        },
        // email_address: {
        //     type: String,
        //     unique: true
        // },
        //referrer: {type: referer},
        nickName: {type: String, default: '无名氏'},
        realName: String,
        realIDNumber: String,
        //publishTime: Date,
        //whatHappenedToMe: [myEvent],
        Bcoins: {type: String, required: true, set: app.encrypt, get: app.decrypt},
        //returnCoins: {type: Number, default: 0},
        points: {type: Number, default: 0},
        //numberOfReferrers: {type: Number, default: 0},
        // aliPayAccounts: [aliPayAccount],
        // bankAccounts: [bankAccount],
        // wechatAccounts: [wechatAccount],
        // myBills: [{type: mongoose.Schema.Types.ObjectId, ref: 'billStatement'}],
        last_login_time: Date
    }, {
        'timestamps': {
            'createdAt': 'created_at', 'updatedAt': 'updated_at', toObject: {virtuals: true},
            toJSON: {virtuals: true}
        }
    });

    userAccountSchema.set('toObject', {
        virtuals: true,
        transform: (doc, ret) => {
            delete ret.__v;
            delete ret._id;
            delete ret.id;
            delete ret.password;
            // ret.Rcoins = doc.Rcoins;
            // ret.VIPLevel = vipCoculart(doc.growthPoints);
            // if (doc.created_at && doc.updated_at) {
            //     ret.created_at = new Date(doc.created_at).getTime();
            //     ret.updated_at = new Date(doc.updated_at).getTime();
            // }
            // if (doc.last_login_time) {
            //     ret.last_login_time = new Date(doc.last_login_time).getTime();
            // }
        }
    });


    return mongoose.model('UserAccount', userAccountSchema,'userAccount');
};
