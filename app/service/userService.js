'use strict';
const moment = require('moment');
const Service = require('egg').Service;

class UserService extends Service {
    // async tryUser(user) {
    //     let uuid = require('cuid')();
    //     const userNew = this.ctx.model.UserAccount(
    //         {username: uuid + 'a', password: uuid + `b`, uuid: uuid, tel_number: uuid + 'f', Bcoins: 123}
    //     );
    //     return userNew;
    // };

    async updateUser(user_uuid, userObj) {

        return await this.ctx.model.UserAccount.findOneAndUpdate({uuid: user_uuid}, {$set: userObj}, {new: true});

    };

    async updateUserPassword(tel_number, newPassword) {

        return await this.ctx.model.UserAccount.findOneAndUpdate({tel_number: tel_number},
            {$set: {password: newPassword}}, {new: true});

    };

    async updateUser_login(user_uuid) {

        return await this.ctx.model.UserAccount.findOneAndUpdate({uuid: user_uuid}, {
            $set: {last_login_time: moment()},
            $inc: {loginTimes: 1}
        }, {new: true});
    };

    async addUser(user) {
        const userNew = this.ctx.model.UserAccount(
            user
        );
        userNew.save();
    };

    async getUser(user) {
        const userNew = await this.ctx.model.UserAccount.findOne(user);
        return userNew;
    };

    async getAllUser() {
        const userNew = await this.ctx.model.UserAccount.find();
        return userNew;
    }
}

module.exports = UserService;