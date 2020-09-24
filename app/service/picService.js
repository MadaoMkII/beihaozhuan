'use strict';
const Service = require('egg').Service;


class picService extends Service {

  async deleteImg(fileUrl) {
    const ossFilePath = this.app.config.oss.client.bucketUrl;
    const deleteFileUrl = fileUrl.replace(ossFilePath, '');
    return await this.ctx.oss.delete(deleteFileUrl);
  }

  async deleteManyImg(fileUrlArray) {
    const ossFilePath = this.app.config.oss.client.bucketUrl;
    const deleteUrlArray = [];
    fileUrlArray.forEach(fileUrl => {
      const newUrl = fileUrl.replace(ossFilePath, '');
      deleteUrlArray.push(newUrl);
    });

    return await this.ctx.oss.deleteMulti(deleteUrlArray);
  }
  async putImages(stream, path = 'images') {

    const filename = `${path}/` + (Math.random() * Date.now() * 10).toFixed(0) + '.jpg';
    const result = await this.ctx.oss.put(filename, stream.filepath);
    return result.url;
  }
  async putImgs(stream, path = 'images') {

    const filename = `${path}/` + (Math.random() * Date.now() * 10).toFixed(0) + '.jpg';
    const result = await this.ctx.oss.put(filename, stream.filepath);
    return result.url;
  }
}

module.exports = picService;
