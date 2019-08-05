module.exports = app => {
    const mongoose = app.mongoose;
    // mongoose.set('useCreateIndex', true);
    // mongoose.set('useFindAndModify', false);
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
        avatar: {type: String, default: 'https://beihaozhuan.oss-cn-zhangjiakou.aliyuncs.com/images/none.gif'},
        gender: {type: String, required: true, default: `male`},
        //publishTime: Date,
        //whatHappenedToMe: [myEvent],
        Bcoins: {type: String, required: true, set: app.encrypt, get: app.decrypt},
        //returnCoins: {type: Number, default: 0},
        birthday: {
            type: Date, default: `1990-01-01`, min: '1940-01-01',
            max: Date.now
        },
        location: {type: String},
        job: String,
        educationLevel: String,
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
            ret.Bcoins = doc.Bcoins;
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
    userAccountSchema.set('toJSON', {
        virtuals: true,
        transform: (doc, ret) => {
            delete ret.__v;
            delete ret._id;
            delete ret.id;
            //delete ret.password;
            ret.Bcoins = doc.Bcoins;
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

    return mongoose.model('UserAccount', userAccountSchema, 'userAccount');
};
