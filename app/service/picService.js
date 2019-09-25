'use strict';
const Service = require('egg').Service;


class picService extends Service {
    async postBook() {

        return {name: "helloworld"}
    }

    async deleteImg(fileUrl) {
        let ossFilePath = this.app.config.oss.client.bucketUrl;
        let deleteFileUrl = fileUrl.replace(ossFilePath, ``);
        return await this.ctx.oss.delete(deleteFileUrl);
    };

    async deleteManyImg(fileUrlArray) {
        let ossFilePath = this.app.config.oss.client.bucketUrl;
        let deleteUrlArray = [];
        fileUrlArray.forEach((fileUrl) => {
            let newUrl = fileUrl.replace(ossFilePath, ``);
            deleteUrlArray.push(newUrl)
        });

        return await this.ctx.oss.deleteMulti(deleteUrlArray);
    };

    async putImgs(stream, path = 'images') {

        const filename = `${path}/` + (Math.random() * Date.now() * 10).toFixed(0) + '.jpg';
        let result = await this.ctx.oss.put(filename, stream.filepath);
        return result.url;
    }
}

module.exports = picService;