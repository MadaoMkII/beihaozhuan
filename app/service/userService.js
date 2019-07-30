'use strict';

const Service = require('egg').Service;

class UserService extends Service {

    async addUser(user) {
        const userNew = this.ctx.model.userAccount(
            {username: user.username, password: user.password}
        );
        userNew.save();
    }
}
module.exports = UserService;