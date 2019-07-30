'use strict';

const Service = require('egg').Service;

class UserService extends Service {
    async tryUser(user) {
        let uuid = require('cuid')();
        const userNew = this.ctx.model.UserAccount(
            {username: uuid+'a', password: uuid+`b`,uuid:uuid,tel_number:uuid+'f',Bcoins:123}
        );
        //console.log(userNew.Bcoins)
        return userNew;
    };
    async addUser(user) {
        const userNew = this.ctx.model.userAccount(
            {username: user.username, password: user.password}
        );
        userNew.save();
    }
}
module.exports = UserService;