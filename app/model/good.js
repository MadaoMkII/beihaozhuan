module.exports = app => {
    const mongoose = app.mongoose;
    let userAccountSchema = new mongoose.Schema({
        uuid: {
            required: true,
            type: String,
            unique: true
        },

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

    return mongoose.model('good', userAccountSchema, 'good');
};
