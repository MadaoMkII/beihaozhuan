module.exports = app => {
    const mongoose = app.mongoose;
    // mongoose.set('useCreateIndex', true);
    // mongoose.set('useFindAndModify', false);

    let balanceRecord = new mongoose.Schema({
        category: {type: String, required: true},
        income: {type: Boolean, required: true, default: true},
        amount: {type: Number, default: 0},
        createTime: Date,
        status: {type: String, enum: [`success`, `failed`, `pending`], default: `pending`}
    }, {});

    balanceRecord.set('toJSON', {
        transform: (origin, show) => {
            delete show.__v;
            delete show._id;
            show.createTime = origin.createTime.getTime();
            // if (doc.created_at && doc.updated_at) {
            //     ret.created_at = new Date(doc.created_at).getTime();
            //     ret.updated_at = new Date(doc.updated_at).getTime();
            // }
            // if (doc.last_login_time) {
            //     ret.last_login_time = new Date(doc.last_login_time).getTime();
            // }
        }
    });
    let userAccountSchema = new mongoose.Schema({
        uuid: {
            required: true,
            type: String,
            unique: true
        },
        withdrawRecord: [{type: mongoose.Schema.Types.Mixed}],
        password: {
            required: true,
            type: String
        },
        role: String,
        userStatus: {
            hasVerifyWechat: {type: Boolean, default: false},
            activity: {type: Boolean, default: true},
        },
        OPENID: {type: String},
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
        Bcoins: {type: String, required: true, set: app.encrypt, get: app.decrypt},
        birthday: {
            type: Date, default: `1990-01-01`, min: '1940-01-01',
            max: Date.now
        },
        location: {type: String},
        job: String,
        educationLevel: String,
        loginTimes: {type: Number},
        dailyMissionTrackers: [{type: mongoose.Schema.Types.ObjectId, ref: 'MissionProcessingTracker'}],
        balanceList: [balanceRecord],
        last_login_time: Date
    }, {
        'timestamps': {
            'createdAt': 'created_at', 'updatedAt': 'updated_at'
        }
    });

    userAccountSchema.set('toJSON', {
        virtuals: true,
        transform: (doc, ret) => {
            delete ret.__v;
            delete ret._id;
            delete ret.id;
            delete ret.password;
            delete ret.updated_at;
            ret.Bcoins = doc.Bcoins;
            // if (doc.created_at && doc.updated_at) {
            //     ret.created_at = new Date(doc.created_at).getTime();
            //     ret.updated_at = new Date(doc.updated_at).getTime();
            // }
            // if (doc.last_login_time) {
            //     ret.last_login_time = new Date(doc.last_login_time).getTime();
            // }
        }
    });
    userAccountSchema.set('toObject', {
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
