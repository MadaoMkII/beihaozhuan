module.exports = app => {
    const mongoose = app.mongoose;
    // mongoose.set('useCreateIndex', true);
    // mongoose.set('useFindAndModify', false);
    const connection = app.mongooseDB.get('userConnection');
    let balanceRecord = new mongoose.Schema({
        category: {type: String, required: true},
        income: {
            type: String,
            enum: ['enable', 'disable'], default: "disable"
        },
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
            unique: true,
            sparse: true
        },
        withdrawRecord: [{type: mongoose.Schema.Types.Mixed}],
        password: {
            required: true,
            type: String
        },
        role: String,
        userStatus: {
            hasVerifyWechat: {
                type: String,
                enum: ['enable', 'disable'], default: "disable"
            },
            activity: {
                type: String,
                enum: ['enable', 'disable'], default: "disable"
            }
        },
        OPENID: {type: String},
        tel_number: {
            required: true,
            type: String,
            unique: true,
            sparse: true
        },
        // email_address: {
        //     type: String,
        //     unique: true
        // },
        //referrer: {type: referer},
        nickName: {type: String, default: '无名氏'},
        realName: {type: String},
        inviteCode: {type: String, default: app.getInviteCode},
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
        //dailyMissionTrackers: [{type: mongoose.Schema.Types.ObjectId, ref: 'MissionProcessingTracker'}],
        balanceList: [balanceRecord],
        referrer: {type: mongoose.Schema.Types.Mixed},//上线
        referrals: [{type: mongoose.Schema.Types.Mixed}],//xia线
        //asyncEventFlag: {type: Boolean, default: false},
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
            if (doc.updated_at) {
                ret.updated_at = app.getFormatDateForJSON(doc.updated_at);
            }
            if (doc.created_at) {
                ret.created_at = app.getFormatDateForJSON(doc.created_at);
            }
            ret.Bcoins = doc.Bcoins;
            if (doc.birthday) {
                ret.birthday = app.getFormatDateForJSON(doc.birthday);
            }

        }
    });
    userAccountSchema.set('toObject', {
        virtuals: true,
        transform: (doc, ret) => {
            delete ret.__v;
            //delete ret._id;
            //delete ret.password;
            ret.Bcoins = doc.Bcoins;

        }
    });

    return connection.model('UserAccount', userAccountSchema, 'userAccount');
};
