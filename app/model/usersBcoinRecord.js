module.exports = app => {
    const mongoose = app.mongoose;
    const connection = app.mongooseDB.get('analyze');
    let usersBcoinRecord = new mongoose.Schema({
        userID: {
            required: true,
            type: app.mongoose.Schema.Types.ObjectId,
        },
        absoluteDate: Date,
        amount: Number,
        reason: String
    }, {
        'timestamps': {
            'createdAt': 'created_at', 'updatedAt': 'updated_at'
        }
    });

    usersBcoinRecord.set('toJSON', {
        virtuals: true,
        transform: (doc, ret) => {
            delete ret.__v;
            delete ret._id;
            if (doc.updated_at) {
                ret.updated_at = app.getFormatDateForJSON(doc.updated_at);
            }
            if (doc.created_at) {
                ret.created_at = app.getFormatDateForJSON(doc.created_at);
            }
        }
    });
    usersBcoinRecord.set('toObject', {
        virtuals: true,
        transform: (doc, ret) => {
            delete ret.__v;
        }
    });
    return connection.model('UsersBcoinRecord', usersBcoinRecord, 'UsersBcoinRecord');
};
