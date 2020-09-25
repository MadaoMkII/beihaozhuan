'use strict';
const BaseService = require('./baseService');
const XLSX = require('xlsx');
const path = require('path');

class excelService extends BaseService {
  async createExcel(dataArray) {
    const workbook = XLSX.utils.book_new();
    const rowInfo = [
      { hpx: 30 },
    ];
    const finalDataArray = [];
    for (let element of dataArray) {
      const tempElement = {};
      element = element._doc;

      tempElement.商品名称 = element.title;
      tempElement.用户手机号 = element.customer_ID.tel_number;
      tempElement.昵称 = element.customer_ID.nickName;
      tempElement.创建时间 = this.ctx.app.getLocalTime(element.created_at);
      tempElement.商品价格 = element.goodPrice;
      tempElement.订单状态 = element.orderStatus;
      tempElement.订单用户真实姓名 = element.realName;
      tempElement.身份证号 = element.IDNumber;
      tempElement.地址 = element.address;
      tempElement.详细地址 = element.detailAddress;
      tempElement.商品分类 = element.goodCategory;

      finalDataArray.push(tempElement);
    }

    const wsCols = [
      { wch: 20 },
      { wch: 18 },
      { wch: 12 },
      { wch: 20 },
      { wch: 9 },
      { wch: 9 },
      { wch: 17 },
      { wch: 21 },
      { wch: 25 },
      { wch: 25 },
      { wch: 20 },
    ];

    const tempRowInfo = Array.from(rowInfo);
    tempRowInfo.push({ hpx: 20 });
    const worksheet = await XLSX.utils.json_to_sheet(finalDataArray);
    worksheet['!cols'] = wsCols;
    worksheet['!rows'] = tempRowInfo;
    XLSX.utils.book_append_sheet(workbook, worksheet, '商品订单列表');

    const fileName = path.resolve(__dirname, `../public/file/${this.ctx.app.getLocalTimeForFileName(new Date())}.xlsx`);
    XLSX.writeFile(workbook, fileName);
    return fileName;
  }


  async getUserList(day, condition, option) {
    const thisDay = this.getTimeQueryByPeriod(day);
    const optionLimit = !this.ctx.helper.isEmpty(option) ? { $limit: option.limit + option.skip } : { $limit: 100000 };
    const optionSkip = !this.ctx.helper.isEmpty(option) ? { $skip: option.skip } : { $skip: 0 };
    const users = await this.ctx.model.UserAccount.aggregate([

      { $match: condition },
      optionLimit,
      optionSkip,
      //
      // {
      //     $unwind: {
      //         path: '$balanceList',
      //         preserveNullAndEmptyArrays: true,
      //     }
      // },
      // {
      //     $project: {
      //         uuid: 1,
      //         tel_number: 1,
      //         nickName: 1,
      //         realName: 1,
      //         Bcoins: 1,
      //         balanceDayOfYear: {
      //             $dayOfYear: {
      //                 date: "$balanceList.createTime",
      //                 timezone: "Asia/Shanghai"
      //             },
      //
      //         },
      //         balanceYear: {
      //             $year: {
      //                 date: "$balanceList.createTime",
      //                 timezone: "Asia/Shanghai"
      //             }
      //         },
      //         amount: "$balanceList.amount",
      //         created_at: "$created_at"
      //     }
      // },
      // {
      //     $match: {
      //         balanceDayOfYear: (Number(yesterday.toFormat('ooo'))),
      //         balanceYear: Number(yesterday.toFormat(`y`))
      //     }
      // },
      // {
      //     $group: {
      //         _id: '$uuid',
      //         todayIncoming: {$sum: '$amount'},
      //         tel_number: {$first: '$tel_number'},
      //         nickName: {$first: '$nickName'},
      //         Bcoins: {$first: '$Bcoins'},
      //         created_at: {$first: '$created_at'}
      //     }
      // },
      {
        $project: {
          uuid: 1,
          tel_number: 1,
          nickName: 1,
          realName: 1,
          Bcoins: 1,
          created_at: '$created_at',
          userStatus: 1,
          balanceList: 1,
        },
      },
      {
        $project: {
          items: {
            $filter: {
              input: '$balanceList',
              as: 'item',
              cond: {
                $and:
                    [
                      { $gte: [ '$$item.createTime', thisDay.created_at.$gte ] },
                      { $lte: [ '$$item.createTime', thisDay.created_at.$lte ] },
                      { $eq: [ '$$item.income', '获得' ] },
                    ],
              },
            },
          },
          uuid: 1,
          tel_number: 1,
          nickName: 1,
          realName: 1,
          Bcoins: 1,
          userStatus: 1,
          created_at: 1,
        },
      },
      {
        $unwind: {
          path: '$items',
          preserveNullAndEmptyArrays: true,
        },
      },
      // { $match: { '$items.income': '消费' } },
      {
        $group: {
          _id: '$uuid',
          todayIncoming: { $sum: '$items.amount' },
          tel_number: { $first: '$tel_number' },
          nickName: { $first: '$nickName' },
          Bcoins: { $first: '$Bcoins' },
          userStatus: { $first: '$userStatus' },
          created_at: { $first: '$created_at' },
        },
      },
    ]);
    console.log(users);
    return users;
  }
  async getUserInfoExecl(day) {
    const XLSX = require('xlsx');
    const app = this.ctx.app;
    const resultData = [];
    const users = await this.getUserList(day, {}, null);
    users.forEach(user => {
      const element = {};
      // if (user.tel_number !== '13602012967') { return; }
      element.用户昵称 = user.nickName;
      element.用户账号 = user.tel_number;
      element.今日收入 = !this.ctx.helper.isEmpty(user.todayIncoming) ? user.todayIncoming : 0;
      element.金币余额 = app.decrypt(user.Bcoins);
      element.注册时间 = app.getLocalTimeForFileName(user.created_at);
      resultData.push(element);
    });
    const rowInfo = [
      { hpx: 30 },
    ];
    const wsCols = [
      { wch: 25 },
      { wch: 20 },
      { wch: 10 },
      { wch: 10 },
      { wch: 10 },
    ];
    const workbook = XLSX.utils.book_new();
    const tempRowInfo = Array.from(rowInfo);
    tempRowInfo.push({ hpx: 20 });
    const worksheet = await XLSX.utils.json_to_sheet(resultData);
    worksheet['!cols'] = wsCols;
    worksheet['!rows'] = tempRowInfo;
    XLSX.utils.book_append_sheet(workbook, worksheet, '商品订单列表');
    const fileName = path.resolve(__dirname, `../public/file/${this.ctx.app.getLocalTimeForFileName(new Date())}.xlsx`);
    XLSX.writeFile(workbook, fileName);
    return fileName;
  }
  async getUserInfoExecl_today() {
    const XLSX = require('xlsx');
    const app = this.ctx.app;
    // const users = await ctx.model.UserAccount.find({ nickName: '老司机', balanceList:
    //       { $elemMatch: { createTime: { $gte: yesterday } } } });
    const resultData = [];

    const yesterday = app.modifyDate('day', -1);
    const users = await this.ctx.model.UserAccount.aggregate([
      {
        $unwind: {
          path: '$balanceList',
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $project: {
          uuid: 1,
          tel_number: 1,
          nickName: 1,
          realName: 1,
          Bcoins: 1,
          balanceDayOfYear: {
            $dayOfYear: {
              date: '$balanceList.createTime',
              timezone: 'Asia/Shanghai',
            },

          },
          balanceYear: {
            $year: {
              date: '$balanceList.createTime',
              timezone: 'Asia/Shanghai',
            },
          },
          amount: '$balanceList.amount',
          created_at: '$created_at',
        },
      },
      {
        $match: {
          balanceDayOfYear: (Number(yesterday.toFormat('ooo'))),
          balanceYear: Number(yesterday.toFormat('y')),
        },
      },
      {
        $group: {
          _id: '$uuid',
          todayIncoming: { $sum: '$amount' },
          tel_number: { $first: '$tel_number' },
          nickName: { $first: '$nickName' },
          Bcoins: { $first: '$Bcoins' },
          created_at: { $first: '$created_at' },
        },
      },
    ]);
    users.forEach(user => {
      const element = {};
      element.用户电话 = user.tel_number;
      element.用户昵称 = user.nickName;
      element.今日收入 = this.ctx.helper.isEmpty(user.todayIncoming) ? 0 : user.todayIncoming;
      element.金币余额 = app.decrypt(user.Bcoins);
      element.注册时间 = app.getLocalTimeForFileName(user.created_at);
      resultData.push(element);
    });

    const rowInfo = [
      { hpx: 30 },
    ];
    const wsCols = [
      { wch: 25 },
      { wch: 20 },
      { wch: 10 },
      { wch: 10 },
      { wch: 10 },
    ];
    const workbook = XLSX.utils.book_new();
    const tempRowInfo = Array.from(rowInfo);
    tempRowInfo.push({ hpx: 20 });
    const worksheet = await XLSX.utils.json_to_sheet(resultData);
    worksheet['!cols'] = wsCols;
    worksheet['!rows'] = tempRowInfo;
    XLSX.utils.book_append_sheet(workbook, worksheet, '商品订单列表');
    const fileName = path.resolve(__dirname, `../public/file/${this.ctx.app.getLocalTimeForFileName(new Date())}.xlsx`);
    XLSX.writeFile(workbook, fileName);
    return fileName;
  }
}

module.exports = excelService;
