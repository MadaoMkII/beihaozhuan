'use strict';

const Service = require('egg').Service;

class UserService extends Service {
    async findUser() {
        const result = await this.ctx.model.User.find();
        return result;
    };

    async findOneUser(user) {
        const result = await this.ctx.model.User.findOne(user);
        return result;
    };

    async addUser(user) {
        const userNew = this.ctx.model.User(
            {username: user.username, password: user.password}
        );
        userNew.save();
    }

    async updateUser() {
        const result = await this.ctx.model.User.updateOne({
            "_id": "5c00f0ce862e9227acb56d22"
        }, {
            password: "cccccccccc"
        });
        return result
    }

    async deleteUser() {
        const result = await this.ctx.model.User.deleteOne({
            "_id": "5c00f0ce862e9227acb56d22"
        });
        return result
    }
}

module.exports = UserService;
