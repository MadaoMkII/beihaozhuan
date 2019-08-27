const egg = require('egg');

const workers = Number(process.argv[2] || require('os').cpus().length);
console.log(`服务器启动！`);
egg.startCluster({
    workers,
    baseDir: __dirname,
    port: process.env.PORT || 3000
});
