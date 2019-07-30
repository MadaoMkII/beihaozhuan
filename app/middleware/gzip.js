module.exports = (options, app) => {
    return async function gzip(ctx, next) {

        console.log(options.threshold+`x`);
        ctx.request.body.zjx = `123`;
        await next();


    }
};