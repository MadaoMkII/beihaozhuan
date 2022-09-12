# 说明
项目已经凉了！
由于没有使用Redis 所以要依赖session记录
由于没有使用Redis 所以要依赖session记录

cookie也可以


1，登陆之后给予goldAmout 记录今天的值，没有则制0, 如果删除就直接给他登出
2，中间件加入审核goldAmout ，没有则报错
3，也许应该设总体上限，
4，采用后增加机制，先加钱后判断是否越界，这样每次值不一样




## QuickStart

<!-- add docs here for user -->

see [egg docs][egg] for more detail.

### Development

```bash
$ npm i
$ npm run dev
$ open http://localhost:7001/
```

### Deploy

```bash
$ npm start
$ npm stop
```

### npm scripts

- Use `npm run lint` to check code style.
- Use `npm test` to run unit test.
- Use `npm run autod` to auto detect dependencies upgrade, see [autod](https://www.npmjs.com/package/autod) for more detail.


[egg]: https://eggjs.org
