'use strict';
const EventEmitter = require('events');
const {Service} = require('egg');

class MissionEventManager extends Service {

    constructor(ctx) {
        super(ctx);
        this.eventEmitter = new EventEmitter();
        this.eventEmitter.on(`start`, async (uuid) => {
            const userNew = await this.ctx.model.UserAccount.findOne({uuid: uuid});
            console.log(userNew)
        });
    };

    async getEventEmitter() {
        return this.eventEmitter;
    }
}

module.exports = MissionEventManager;
