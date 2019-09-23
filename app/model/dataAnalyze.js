module.exports = app => {
    const mongoose = app.mongoose;
    const connection = app.mongooseDB.get('userConnection');
    let dataAnalyze = new mongoose.Schema({
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
        last_login_time: Date
    }, {
        'timestamps': {
            'createdAt': 'created_at', 'updatedAt': 'updated_at'
        }
    });

    dataAnalyze.set('toJSON', {
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
        }
    });
    dataAnalyze.set('toObject', {
        virtuals: true,
        transform: (doc, ret) => {
            delete ret.__v;
            ret.Bcoins = doc.Bcoins;
        }
    });

    return connection.model('DataAnalyze', dataAnalyze, 'DataAnalyze');
};
