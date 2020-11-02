'use strict';
const Service = require('egg').Service;
const { DateTime } = require('luxon');

class WeChatService extends Service {
  async toQueryString(obj) {
    return Object.keys(obj)
      .filter(key => key !== 'sign' && obj[key] !== void 0 && obj[key] !== '')
      .sort()
      .map(key => key + '=' + obj[key])
      .join('&');
  }

  async getSign(params, type = 'MD5') {
    const str = await this.toQueryString(params) + '&key=' + this.ctx.app.config.wechatConfig.key;
    let signedStr = '';
    switch (type) {
      case 'MD5':
        signedStr = String(require('md5')(str)).toUpperCase();
        break;
      case 'SHA1':
        signedStr = String(require('sha1')(str)).toUpperCase();
        break;
      default:
        throw new Error('signType Error');
    }
    return [ str, signedStr ];
  }

  async signString(signObject) {
    let signStr = '';
    Object.keys(signObject).sort().forEach((key, index) => {
      if (index !== 0) signStr += '&';
      signStr += `${key}=${signObject[key]}`;
    });
    // `jsapi_ticket=${jsapi_ticket}&noncestr=${randomStr}&timestamp=${timeStamp}&url=${url}`;
    const sha1 = require('sha1');
    return [ signStr, sha1(signStr) ];
  }

  async getRealNickName() {
    const access_token = await this.get_access_token();
    const requestObj_3 = {
      access_token,
      openid: this.ctx.user.OPENID,
      lang: 'zh_CN',
    };

    const [ result_3 ] = await this.app.requestMethod(requestObj_3,
      'GET', 'https://api.weixin.qq.com/cgi-bin/user/info');
    console.log(result_3);
    if (result_3.errcode) {
      return;
    }
    return result_3;
  }

  async withdrewConstraint(user, type) {
    let pass = true,
      msg = '';
    let result;
    switch (type) {
      case '双十二活动':
        result = await this.ctx.model.DoubleDec.findOne({ userUUid: user.uuid });
        if (!this.ctx.helper.isEmpty(result)) {
          if (result.status !== '审核通过') {
            pass = false;
            msg = '活动没有达到要求或者已经领取';
          }
          await this.ctx.model.DoubleDec.findOneAndUpdate({ userUUid: user.uuid },
            { $set: { status: '已领取' } });
        } else {
          msg = '请先完成活动要求';
          pass = false;
        }
        break;

      case '平台提现':

        // eslint-disable-next-line no-case-declarations

        const local = DateTime.fromJSDate(new Date()).reconfigure({ locale: 'zh-CN' });
        await this.ctx.model.Withdrew.find({
          created_at: {
            $gte: local.startOf('day').toJSDate(),
            $lte: local.endOf('day').toJSDate(),
          },
        }, {
          desc: 1,
          amount: 1,
          partner_trade_no: 1,
          nickName: 1,
          return_msg: 1,
          created_at: 1,
          result_code: 1,
        });
        // eslint-disable-next-line no-case-declarations
        // const succeedTimes = records.filter(x => x.result_code !== 'FAIL').length;
        // if (this.ctx.helper.isEmpty(records) || succeedTimes < 1) {
        //   return [ pass, msg ];
        // }
        // pass = false; msg = '今天已经提过现啦，明天再来试试吧~';
        break;

      default:
        break;
    }

    return [ pass, msg ];
  }
  async getWithdrewStatus() {

    const user = this.ctx.user;
    const recentUserAccount = await this.ctx.model.UserAccount.findOne({ tel_number: user.tel_number });

    const withdrewRecord = await this.ctx.model.Withdrew.find({ userUUid: user.uuid });
    const setting = await this.ctx.model.SystemSetting.findOne({}, {}, { $sort: { updated_at: -1 } });
    const withDrewSetting = setting.withDrewSetting;
    const result = [];

    for (const setting of withDrewSetting) {
      const tempObj = {
        enough: true,
        alreadyWithdrew: false,
        amount: setting.amount,
        type: setting.optionType,
      };
      const record = withdrewRecord.find(e => Number(e.amount) === Number(setting.amount));
      if (!this.ctx.helper.isEmpty(record)) {
        tempObj.alreadyWithdrew = true;
      }
      if (Number(recentUserAccount.Bcoins) < Number(setting.amount)) {
        tempObj.enough = false;
      }
      result.push(tempObj);
    }
    return result;
  }
  async withdrew(amount, desc = '平台提现', ip, partner_trade_no, category) {


    const user = this.ctx.user;
    const lastWithDrew = await this.ctx.model.Withdrew.findOne({
      result_code: 'SUCCESS',
      category,
      userUUid: user.uuid });
    if (!this.ctx.helper.isEmpty(lastWithDrew)) {
      this.ctx.throw(400, '您已经提过这个档位的钱了');
    }

    const recentUserAccount = await this.ctx.model.UserAccount.findOne({ tel_number: user.tel_number });

    if (Number(recentUserAccount.Bcoins) < Number(amount)) {
      this.ctx.throw(200, '用户余额不足');
    }
    const newBcoin = Number(recentUserAccount.Bcoins) - Number(amount);
    if (newBcoin < 0) {
      this.ctx.throw(200, '用户所剩的余额不足');
    }
    const inputObj = {
      mch_appid: this.ctx.app.config.wechatConfig.appid,
      mchid: this.ctx.app.config.wechatConfig.mchid,
      nonce_str: this.ctx.randomString(32),
      partner_trade_no,
      openid: user.OPENID,
      check_name: 'NO_CHECK',
      re_user_name: '',
      amount: amount / 100,
      desc,
      spbill_create_ip: ip,
    };
    const [ , signedStr ] = await this.getSign(inputObj);
    inputObj.sign = signedStr;

    const xml2js = require('xml2js');
    const builder = new xml2js.Builder({ headless: true, rootName: 'xml' });
    const xml = builder.buildObject(inputObj);

    const path = require('path');
    const appDir = path.resolve(process.cwd(), './');

    const [ result ] = await this.ctx.app.requestMethod(xml, 'POST',
      'https://api.mch.weixin.qq.com/mmpaymkttransfers/promotion/transfers',
      path.resolve(appDir + '//config/apiclient_cert.p12'), true);
    const parser = new xml2js.Parser({ explicitArray: false, explicitRoot: false });
    const withdrewResult = await parser.parseStringPromise(result);
    if (!this.ctx.helper.isEmpty(withdrewResult) && withdrewResult.result_code !== 'FAIL') {
      console.log('OK');
      //   await this.ctx.service.analyzeService.dataIncrementRecord('提现',
      //     -amount, 'bcoin', '提现');
      //   await this.ctx.service.userService.setUserBcionChange(user.uuid, '提现',
      //     '消费', -amount, newBcoin);
      // }
      await this.ctx.service.userService.modifyUserRcoin({
        tel_number: user.tel_number,
        amount: Number(amount),
        content: '提现',
        type: '提现',
      });
    }
    const withDrewEntity = {
      category,
      guestIP: ip,
      desc,
      amount,
      OPENID: user.OPENID,
      partner_trade_no,
      nickName: user.nickName,
      userUUid: user.uuid,
      withdrewResult,
      return_msg: !this.ctx.helper.isEmpty(withdrewResult.return_msg) ? withdrewResult.return_msg : '支付成功',
      result_code: withdrewResult.result_code,
    };
    const withDrewObj = new this.ctx.model.Withdrew(withDrewEntity);
    await withDrewObj.save();
    return withdrewResult;
  }

  async getWithdrew(conditions, option, project) {
    return this.ctx.model.Withdrew.find(conditions, project, option);
  }

  // async update_accessToken() {
  //     const requestObj_1 = {
  //         appid: this.ctx.app.config.wechatConfig.appid,
  //         secret: this.ctx.app.config.wechatConfig.secret,
  //         grant_type: 'client_credential',
  //     };
  //
  //     const [result_1] = await this.ctx.app.requestMethod(requestObj_1,
  //         'GET', 'https://api.weixin.qq.com/cgi-bin/token');
  //
  //     if (!this.ctx.helper.isEmpty(result_1.errcode)) {
  //         this.ctx.throw(400, result_1.errmsg);
  //     }
  //     await this.ctx.model.SystemSetting.findOneAndUpdate({},
  //         {$set: {access_token: {tokenStr: result_1.access_token, createTime: new Date()}}},
  //         {sort: {updated_at: -1}, new: true});
  //     return result_1.access_token;
  // }

  // async get_access_token() {
  //   let result;
  //   const recentTimeModified = this.ctx.app.modifyDate('second', -7210).toJSDate();
  //   const settingObj = await this.ctx.model.SystemSetting.findOne({}, {},
  //     { sort: { updated_at: -1 } });
  //   if (!this.ctx.helper.isEmpty(settingObj.access_token)) {
  //     if (recentTimeModified >= settingObj.access_token.createTime) {
  //       result = await this.update_accessToken();
  //     } else {
  //       result = settingObj.access_token.tokenStr;
  //     }
  //   } else {
  //     result = await this.update_accessToken();
  //   }
  //   return result;
  // }
  async get_access_token() {
    const { isEmpty } = this.ctx.helper;
    const end = DateTime.fromJSDate(new Date());

    const appSystemSetting = await this.ctx.model.SystemSetting.findOne({}, {}, { sort: { created_at: -1 } });

    const accessToken = appSystemSetting._doc.accessToken;
    if (isEmpty(appSystemSetting) ||
                isEmpty(accessToken) || isNaN(accessToken.updateTime) ||
                end.diff(DateTime.fromJSDate(accessToken.updateTime)).as('hours') >= 2) {
      const requestObj = {
        secret: this.ctx.app.config.wechatConfig.secret,
        grant_type: 'client_credential',
        appid: this.ctx.app.config.wechatConfig.appid,
      };

      const [ result_1 ] = await this.ctx.app.requestMethod(requestObj,
        'GET', 'https://api.weixin.qq.com/cgi-bin/token');

      if (!this.ctx.helper.isEmpty(result_1.errcode)) {
        this.ctx.throw(400, result_1.errmsg);
      }
      const settObj = {
        updateTime: new Date(),
        tokenStr: result_1.access_token,
      };
      const x = await this.ctx.model.SystemSetting.findOneAndUpdate({ 'accessToken.updateTime': accessToken.updateTime }, { $set: {
        accessToken: { updateTime: new Date(), tokenStr: result_1.access_token },
      } }, { new: true });
      console.log(x);
      return settObj.tokenStr;
    }
    return appSystemSetting.accessToken.tokenStr;

  }

  async setToken() {
    // const requestObj_1 = {
    //     appid: this.ctx.app.config.wechatConfig.appid,
    //     secret: this.ctx.app.config.wechatConfig.secret,
    //     grant_type: 'client_credential',
    // };
    //
    // const [result_1] = await this.app.requestMethod(requestObj_1,
    //     'GET', 'https://api.weixin.qq.com/cgi-bin/token');
    //
    // if (!this.ctx.helper.isEmpty(result_1.errcode)) {
    //     this.ctx.throw(400, result_1.errmsg);
    // }

    // await this.ctx.model.Setting.findOneAndUpdate({ }, { $set: { access_token: result_1.access_token } }, { upsert: true });

    // '26_EpDz1uSWyf3ZQPW2ZCmN49rx8RlPXSA6z_e8NKSHGbUFCbiJWJFDWvfSLKKIg8FCkz2_XEuxNoEsRgPhy0SEeQU60H2kuceAXVjOHjgzSGGd7PrW9vh5OqwgPaq7AoiYpOB9Wpsd0og6UdMoFDGdAIAYWZ'
    const token = await this.get_access_token();
    const requestObj_2 = {
      access_token: token,
      type: 'jsapi',
    };
    const [ result_2 ] = await this.app.requestMethod(requestObj_2,
      'GET', 'https://api.weixin.qq.com/cgi-bin/ticket/getticket');

    if (result_2.errcode !== 0) {
      this.ctx.throw(400, result_2.errmsg);
    }

    // await this.ctx.model.Setting.findOneAndUpdate({ jsapi_ticket: null }, { $set: { jsapi_ticket: result_2.ticket } });
    return result_2.ticket;
  }


  async sendMessageCard(nickName, uuid, category, content, result, OPENID) {
    const token = await this.get_access_token();

    const urlFull = `https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=${token}`;

    const requestObj_1 = {
      touser: OPENID,
      template_id: this.app.config.wechatConfig.messageData_approveResult_template_id,
      url: `https://www.beihaozhuan.com/cashback-activity/tasks/${uuid}?stepText=${category}`,
      data: {
        first: {
          value: '您好,审核结果通知:',
          color: '#173177',
        },
        keyword1: {
          value: nickName,
          color: '#173177',
        },
        keyword2: {
          value: content,
          color: '#173177',
        },
        keyword3: {
          value: result,
          color: '#173177',
        },
        keyword4: {
          value: this.app.getLocalTime(new Date()),
          color: '#173177',
        },
        remark: {
          value: '感谢您的参与',
          color: '#173177',
        },
      },


    };
    await this.ctx.app.requestMethod(requestObj_1, 'POST', urlFull);
  }


}

module.exports = WeChatService;
