'use strict';

const Controller = require('./baseController');
const fs = require('fs');
const path = require('path');

class picController extends Controller {


    async delImgs(ctx) {
        let body = [
            "https://beihaozhuan.oss-cn-zhangjiakou.aliyuncs.com/images/11354820137869.jpg",
            "https://beihaozhuan.oss-cn-zhangjiakou.aliyuncs.com/images/336568005599.jpg",
            "https://beihaozhuan.oss-cn-zhangjiakou.aliyuncs.com/images/1578842122952.jpg"
        ];
        let result = await this.service.picService.deleteManyImg(body)
        if (result !== null && result.res.status === 200) {
            return this.success(result);
        } else {
            return this.failure()
        }

    };

    async deleteImg(ctx) {
        try {
            let {imageUrl} = ctx.request.query;


            let result = await ctx.service.picService.deleteImg(imageUrl);

            if (ctx.helper.isEmpty(result) || 200 !== result.res.status) {
                return this.failure(`find not`, 404);
            }
            this.success();
        } catch (e) {
            this.failure(`delete failed`);
        }
    };

    async uploadImgs(ctx) {
        try {

            const files = ctx.request.files;

            //const stream = await ctx.getFileStream();
            let ossurl;
            files.forEach((file) => {
                ossurl = ctx.service.picService.putImgs(file);
            });

            this.success();
        } catch (e) {

            this.failure();
        }
        //console.log('got %d files', ctx.request.files.length);
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

    };


}

module.exports = picController;