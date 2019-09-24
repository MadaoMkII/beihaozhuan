'use strict';
const {Service} = require('egg');

class advertisementService extends Service {

    async createAdvertisement(advertising) {
        advertising.uuid = `ADV` + require('cuid')();
        let advertisingObj = new this.ctx.model.Advertisement(advertising);
        advertisingObj.save();
    };

    async updateAdvertisement(uuid, advertising) {
        delete advertising.uuid;
        return this.ctx.model.Advertisement.findOneAndUpdate({uuid: uuid}, {$set: advertising});
    };

    async deleteAdvertisement(uuid,) {
        return this.ctx.model.Advertisement.deleteOne({uuid: uuid});
    };

    async getAdvertisement(advertising, options) {
        return this.ctx.model.Advertisement.find(advertising, {}, options);
    };

    async getAdvertisementByPosition(positionName) {
        return this.ctx.model.Advertisement.aggregate([{
            $match: {
                positionName: positionName,
                activity: "enable"
            }
        },
            {
                $group:
                    {
                        _id: "$positionName",
                        advertisements: {$push: {carouselUrl: "$carouselUrl", source: "$source", uuid: "$uuid"}},
                        length: {$avg: "$length"},
                        width: {$avg: "$width"}
                    }
            }
        ]);
    };

}

module.exports = advertisementService;