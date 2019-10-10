module.exports = app => {
    const mongoose = app.mongoose;
    const connection = app.mongooseDB.get('loggerConnection');
    let logger = new mongoose.Schema({
        level: String,
        message: String,
        ip: String,
        originalUrl: String,
        date: Date,
        tel_number: String,
        reason: String,
        request: mongoose.Schema.Types.Mixed,
        uuid: String,
        nickName: String,
        realName: String,
        role: String,
        stack: String
    });

    logger.set('toJSON', {
        virtuals: true,
        transform: (doc, ret) => {
            delete ret.__v;
            delete ret._id;
            delete ret.id;
            if (doc.date) {
                ret.date = app.getLocalTime(doc.date);
            }
        }
    });
    logger.set('toObject', {
        virtuals: true,
        transform: (doc, ret) => {
            delete ret.__v;
        }
    });
    return connection.model('Logger', logger, 'Logger');
};
