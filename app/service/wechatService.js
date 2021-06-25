'use strict';
const BaseService = require('./baseService');
const { DateTime } = require('luxon');
const path = require('path');
class WeChatService extends BaseService {
  async getWithdrewList(condition, option) {
    if (!this.isEmpty(condition.title)) {
      condition.title = { $regex: `.*${condition.title}.*` };
    }
    if (!this.isEmpty(condition.tel_number)) {
      condition.tel_number = { $regex: `.*${condition.tel_number}.*` };
    }
    condition.result_code = 'SUCCESS';
    const result = await this.ctx.model.Withdrew.find(condition, {}, option);
    return [ result, condition ];
  }

  async createWithdrewConstraint(condition) {
    condition.amount = condition.amount * 100;
    const obj = new this.ctx.model.WithdrewConstraint(condition);
    obj.save();
  }
  async getWithdrewConstraintList() {
    return this.ctx.model.WithdrewConstraint.find({ status: 'enable' }, { created_at: false, status: false });
  }

  async getWithdrewConstraintList_User() {
    const constraints =
      await this.ctx.model.WithdrewConstraint.
        find({ status: 'enable' }, { created_at: false, status: false });
    const result = [];
    for (const con of constraints) {
      let flag = true;
      try {
        await this.checkConstraint(con);
      } catch (e) {
        flag = false;
      }
      const res = {
        title: con.title,
        amount: con.amount,
        period: con.period,
        withdrewConstraintTimes: con.withdrewConstraintTimes,
        onlyOneTime: con.onlyOneTime,
        description: con.description,
        id: con._id,
        availableForWithdrew: flag,
      };
      result.push(res);
    }
    return result;
  }

  async updateWithdrewConstraintList(condition) {
    await this.ctx.model.WithdrewConstraint.updateOne({ _id: condition.id }, { $set: condition });
  }
  async deleteWithdrewConstraintList(condition) {
    await this.ctx.model.WithdrewConstraint.updateOne({ _id: condition.id }, { $set: { status: 'disable' } });
  }

  async realWithdrewConstraint(constraintId, ip) {
    const { user } = this.ctx;
    if (this.isEmpty(user.OPENID)) {
      return this.success('该用户没有注册微信', 'OK', 400);
    }
    if (this.isEmpty(!user.realName)) {
      this.ctx.throw(200, '用户没有实名制，请先输入实名');
    }
    const constraint = await this.ctx.model.WithdrewConstraint.findOne({ _id: this.app.mongoose.Types.ObjectId(constraintId) });
    if (this.isEmpty(constraint)) {
      this.ctx.throw(400, '找不到这条取款条件记录');
    }
    await this.checkConstraint(constraint);
    const recentUserAccount = await this.ctx.model.UserAccount.findOne({ tel_number: user.tel_number });
    const amount = Number(constraint.amount);
    if (Number(recentUserAccount.Bcoins) < amount) {
      this.ctx.throw(200, '用户余额不足');
    }
    const newBCoin = Number(recentUserAccount.Bcoins) - amount;
    if (newBCoin < 0) {
      this.ctx.throw(200, '用户所剩的余额不足');
    }
    const partner_trade_no = 100 + this.ctx.helper.randomNumber(10);
    if (amount >= 60000) {
      this.ctx.throw(50000, '提款数目过大');
    }
    const inputObj = {
      mch_appid: this.ctx.app.config.wechatConfig.appid,
      mchid: this.ctx.app.config.wechatConfig.mchid,
      nonce_str: this.ctx.randomString(32),
      partner_trade_no,
      openid: user.OPENID,
      check_name: 'FORCE_CHECK',
      re_user_name: user.realName,
      amount: amount / 100, // Number(constraint.amount),
      desc: constraint.title,
      spbill_create_ip: ip,
    };
    const [ , signedStr ] = await this.getSign(inputObj);
    inputObj.sign = signedStr;

    const xml2js = require('xml2js');
    const builder = new xml2js.Builder({ headless: true, rootName: 'xml' });
    const xml = builder.buildObject(inputObj);
    const appDir = path.resolve(process.cwd(), './');
    const [ result ] = await this.ctx.app.requestMethod(xml, 'POST',
      'https://api.mch.weixin.qq.com/mmpaymkttransfers/promotion/transfers',
      path.resolve(appDir + '//config/apiclient_cert.p12'), true);
    const parser = new xml2js.Parser({ explicitArray: false, explicitRoot: false });
    const withdrewResult = await parser.parseStringPromise(result);
    if (!this.ctx.helper.isEmpty(withdrewResult) && withdrewResult.result_code !== 'FAIL') {
      console.log('OK');
      await this.ctx.service.userService.modifyUserRcoin({
        tel_number: user.tel_number,
        amount: -amount,
        content: '提现',
        type: '提现',
      });
    }
    const withDrewEntity = {
      category: 'normal',
      guestIP: ip,
      desc: constraint.title,
      constraint_id: constraint._id,
      amount: amount / 100,
      OPENID: user.OPENID,
      partner_trade_no,
      nickName: user.nickName,
      tel_number: user.tel_number,
      user_id: user._id,
      source: user.source,
      withdrewResult,
      return_msg: !this.isEmpty(withdrewResult.return_msg) ? withdrewResult.return_msg : '支付成功',
      result_code: withdrewResult.result_code,
    };
    const withDrewObj = new this.ctx.model.Withdrew(withDrewEntity);
    await withDrewObj.save();
    return withdrewResult;
  }

  async checkConstraint(constraint) {
    let query = {},
      limited_times;
    if (!constraint.onlyOneTime) { // 不是唯一一次
      query = this.getTimeQueryByPeriod('本' + constraint.period);
      limited_times = constraint.withdrewConstraintTimes;
    } else {
      limited_times = 1;
    }
    query.tel_number = this.ctx.user.tel_number;
    query.return_msg = '支付成功';
    query.constraint_id = constraint._id;
    const count = await this.ctx.model.Withdrew.countDocuments(query);
    console.log(count);
    if (count >= limited_times) {
      this.ctx.throw(400, '提现次数已满');
    }
  }

  // async updateWithdrewConstraint(condition) {
  //   await this.ctx.model.WithdrewConstraint.updateOne({ _id: condition.id }, { $set: condition });
  // }


  //-----------------------
  // async getWithdrewList(condition, option) {
  //   option.sort = { created_at: -1 };
  //   return this.ctx.model.Withdrew.find(condition, {}, option);
  // }
  async toQueryString(obj) {
    return Object.keys(obj)
      .filter(key => key !== 'sign' && obj[key] !== void 0 && obj[key] !== '')
      .sort()
      .map(key => key + '=' + obj[key])
      .join('&');
  }

  async getSign(params, type = 'MD5', key = this.ctx.app.config.wechatConfig.key) {
    const str = await this.toQueryString(params) + '&key=' + key;
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
  // async withdrew(amount, desc = '平台提现', ip, partner_trade_no, category) {
  //
  //
  //   const user = this.ctx.user;
  //   const lastWithDrew = await this.ctx.model.Withdrew.findOne({
  //     result_code: 'SUCCESS',
  //     category,
  //     userUUid: user.uuid });
  //   if (!this.ctx.helper.isEmpty(lastWithDrew)) {
  //     this.ctx.throw(400, '您已经提过这个档位的钱了');
  //   }
  //
  //
  // }

  async getWithdrew(conditions, option, project) {
    option.sort = { created_at: -1 };
    return this.ctx.model.Withdrew.find(conditions, project, option);
  }

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
