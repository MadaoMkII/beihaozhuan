'use strict';

const Service = require('egg').Service;

class UserService extends Service {
    async tryUser(user) {
        let uuid = require('cuid')();
        const userNew = this.ctx.model.UserAccount(
            {username: uuid + 'a', password: uuid + `b`, uuid: uuid, tel_number: uuid + 'f', Bcoins: 123}
        );
        return userNew;
    };

    async updateUser(user) {
        const userNew = this.ctx.model.UserAccount.findOneAndUpdate({uuid: user.uuid}, {$set: user}, {new: true});
        return userNew;
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