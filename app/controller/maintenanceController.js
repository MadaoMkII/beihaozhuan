'use strict';
const Controller = require('./baseController');

class maintenanceController extends Controller {

    async getData(ctx) {

        console.log(ctx.request.body)


        this.success();

    }


}

module.exports = maintenanceController;
