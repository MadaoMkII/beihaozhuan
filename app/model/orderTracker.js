module.exports = app => {
    const mongoose = app.mongoose;
    const connection = app.mongooseDB.get('orderGoodConnection');
    let orderTracker = new mongoose.Schema({
        customer_ID: {type: mongoose.Schema.Types.ObjectId, required: true},
        goodID: {type: mongoose.Schema.Types.ObjectId, required: true},
        orderUUid: {type: String, required: true},
        userUUid: String,
        redeemCode: String,
        orderStatus: {
            type: String,
            enum: ['Close', 'Pending', `Complete`], default: "Pending"
        },
        mainlyShowPicUrl: String,
        title: {type: String, required: true},
        additionalInformation: {type: mongoose.Schema.Types.Mixed},
        goodCategory: {type: String, required: true},
        goodPrice: {type: Number, required: true},
        realName: String,
        IDNumber: String,
        address: String,
        detailAddress: String
    }, {
        'timestamps': {
            'createdAt': 'created_at', 'updatedAt': 'updated_at'
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
    orderTracker.set('toJSON', {
        virtuals: true,
        transform: (doc, ret) => {
            delete ret.__v;
            delete ret._id;
            delete ret.id;
            delete ret.customer_ID;
            delete ret.created_at;
            //delete ret.password;
            // ret.Bcoins = doc.Bcoins;
            // ret.VIPLevel = vipCoculart(doc.growthPoints);
            if (doc.created_at) {
                ret.created_at = app.getFormatDateForJSON(doc.created_at);
            }
            // if (doc.last_login_time) {
            //     ret.last_login_time = new Date(doc.last_login_time).getTime();
            // }
        }
    });

    return connection.model('OrderTracker', orderTracker, 'OrderTracker');
};
