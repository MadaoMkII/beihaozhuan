module.exports = app => {
    const mongoose = app.mongoose;
    const connection = app.mongooseDB.get('commonConnection');
    let goodSchema = new mongoose.Schema({
        uuid: {
            required: true,
            type: String,
            unique: true
        },
        title: {type: String, required: true},
        category: {type: String, required: true, default: '未分类'},
        // featuredFirst: {type: String, required: true, default: "mainPage"},
        slideShowPicUrlArray: {
            type: Array,
            default: [`https://beihaozhuan.oss-cn-zhangjiakou.aliyuncs.com/images/001.jpg`,
                `https://beihaozhuan.oss-cn-zhangjiakou.aliyuncs.com/images/002.jpg`,
                `https://beihaozhuan.oss-cn-zhangjiakou.aliyuncs.com/images/003.jpg`]
        },
        price: {
            type: Number,
            min: [0, 'Must bigger than 0 ']
        },
        description: String,
        inventory: {
            type: Number,
            min: [0, 'Must bigger than 0 '],
            max: 1000
        },
        mainlyShowPicUrl: {
            type: String,
            default: `https://beihaozhuan.oss-cn-zhangjiakou.aliyuncs.com/UI/QQ%E6%88%AA%E5%9B%BE20190827233433.png`
        },
        status: {
            type: String,
            enum: ['activity', 'disable'], default: "disable"
        },
        insuranceLink: {type: String},
        paymentMethod: {
            type: String,
            enum: ['Bcoin', 'Money'], default: "Money"
        },
        last_login_time: Date
    }, {
        'timestamps': {
            'createdAt': 'created_at', 'updatedAt': 'updated_at', toObject: {virtuals: true},
            toJSON: {virtuals: true}
        }
    });

    // goodSchema.set('toObject', {
    //     virtuals: true,
    //     transform: (doc, ret) => {
    //         delete ret.__v;
    //         delete ret._id;
    //         delete ret.id;
    //         delete ret.password;
    //         ret.Bcoins = doc.Bcoins;
    //         // ret.VIPLevel = vipCoculart(doc.growthPoints);
    //         // if (doc.created_at && doc.updated_at) {
    //         //     ret.created_at = new Date(doc.created_at).getTime();
    //         //     ret.updated_at = new Date(doc.updated_at).getTime();
    //         // }
    //         // if (doc.last_login_time) {
    //         //     ret.last_login_time = new Date(doc.last_login_time).getTime();
    //         // }
    //     }
    // });
    goodSchema.set('toJSON', {
        virtuals: true,
        transform: (doc, ret) => {
            delete ret.__v;
            delete ret._id;
            delete ret.id;
            delete ret.created_at;
            delete ret.updated_at;
            //delete ret.password;
            // ret.Bcoins = doc.Bcoins;
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

    return connection.model('Good', goodSchema, 'Good');
};
