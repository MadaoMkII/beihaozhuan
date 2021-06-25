'use strict';
const Controller = require('./baseController');
class picController extends Controller {

  async delImgs(ctx) {
    try {
      const body = [
        'https://beihaozhuan.oss-cn-zhangjiakou.aliyuncs.com/images/11354820137869.jpg',
        'https://beihaozhuan.oss-cn-zhangjiakou.aliyuncs.com/images/336568005599.jpg',
        'https://beihaozhuan.oss-cn-zhangjiakou.aliyuncs.com/images/1578842122952.jpg',
      ];
      const result = await this.service.picService.deleteManyImg(body);
      if (result !== null && result.res.status === 200) {
        return this.success(result);
      }
      return this.failure();

    } catch (e) {
      ctx.throw(503, 'shanchu');
    }
  }

  async deleteImg(ctx) {
    try {
      const { imageUrl } = ctx.request.query;
      const result = await ctx.service.picService.deleteImg(imageUrl);
      if (ctx.helper.isEmpty(result) || result.res.status !== 200) {
        return this.failure('find not', 404);
      }
      this.success();
    } catch (e) {
      this.app.logger.error(e, ctx);
      this.failure();
    }
  }
  async uploadImages(ctx) {
    try {
      let { path } = ctx.request.query;
      const files = ctx.request.files;
      console.log(files);
      console.log(ctx.app.config.email);
      // const stream = await ctx.getFileStream();
      const imageUrl = [];
      path = path ? path : 'images';
      for (const file of files) {
        const url = await ctx.service.picService.putImages(file, path);
        imageUrl.push(url);
      }
      // if (imageUrl.length === 1) {
      //   return this.success(imageUrl[0]);
      // }
      this.success(imageUrl);
    } catch (e) {
      console.log(e);
      this.failure(e);
    }
  }
  async uploadImages_local(ctx) {
    try {
      const files = ctx.request.files;
      // const stream = await ctx.getFileStream();

      files.forEach(file => {
        ctx.service.picService.putImgs(file);
      });
      this.success();
    } catch (e) {
      this.app.logger.error(e, ctx);
      this.failure();
    }
    // console.log('got %d files', ctx.request.files.length);
    // for (const file of ctx.request.files) {
    //     console.log('field: ' + file.fieldname);
    //     console.log('filename: ' + file.filename);
    //     console.log('encoding: ' + file.encoding);
    //     console.log('mime: ' + file.mime);
    //     console.log('tmp filepath: ' + file.filepath);
    // }
    //
    // //const name = 'egg-oss-demo/' + path.basename(file.filename);
    // let result;
    // try {
    //     result = await ctx.oss.put(name, file.filepath);
    // } finally {
    //     await fs.unlink(file.filepath);
    // }
    // if (result) {
    //     console.log('get oss object: %j', object);
    //     ctx.unsafeRedirect(result.url);
    // } else {
    //     ctx.body = 'please select a file to upload！';
    // }
  }
}
module.exports = picController;
