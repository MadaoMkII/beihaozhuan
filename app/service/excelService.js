'use strict';
const BaseService = require('./baseService');
const XLSX = require('xlsx');
const path = require('path');
class excelService extends BaseService {
  async exportList_downloadOverview() {
    const aggregateResult = await this.ctx.model.AnalyzeLog.aggregate([

      { $match: { type: 'download_daily' } },
      { $group: {
        _id: {
          day: { $dayOfYear: '$analyzeDate' },
          // gameName: '$category',
        },
        valueList: { $push: { tel_numberArray: '$dataArray', gameName: '$category' } },
      } },
    ]);
    const wscols = [
      { wch: 20 },
    ];
    const gameNames = await this.ctx.model.GameEvent.aggregate([
      { $unwind: '$gameSetting' },
      { $project: {
        _id: 0,
        gameName: '$gameSetting.gameName',
      } },
      { $group: {
        _id: 0,
        gameNames: { $addToSet: '$gameName' },
      } },
    ]);
    // const res = await this.ctx.model.AnalyzeLog.find({ type: 'download_daily' }, {
    //   analyzeDate: 1,
    //   dataArray: 1,
    //   category: 1,
    //   category_2: 1,
    // });


    const finalResult = [];


    for (const obj of aggregateResult) {
      const day = obj._id.day;
      const tempMap = new Map();
      let longest = 0;
      for (const e of obj.valueList) {
        longest = Math.max(longest, e.tel_numberArray.length);
        tempMap.set(e.gameName, e.tel_numberArray);
      }
      for (let index = 0; index < longest; index++) {
        const tempArray = [];
        tempArray.push(this.formatDayOfYear(day));
        for (const gameName of gameNames[0].gameNames) {
          const tempResult = tempMap.get(gameName);
          if (tempResult) {
            tempArray.push(tempResult[index]);
          } else {
            tempArray.push('');
          }
        }
        finalResult.push(tempArray);

      }

    }


    const header1 = gameNames[0].gameNames;
    const wsMerge = [ XLSX.utils.decode_range('A1:A2') ];
    header1.map((res, idx, array) => {
      const hdMergeObj = {
        s: { r: 0 },
        e: { r: 0 },
      };
      if (idx % 1 === 0) {
        // array.splice(3 * idx + 1, 0, '', '');
        hdMergeObj.s.c = 1 * idx + 1;
        hdMergeObj.e.c = hdMergeObj.s.c + 0;
        wsMerge.push(hdMergeObj);
      }
      return res;
    });


    const header2 = Array(header1.length).fill('下载账号'); // .concat('库存数量');

    for (let i = 0; i < header2.length; i++) {
      wscols.push({ wch: 27 });
    }
    const ws = XLSX.utils.aoa_to_sheet([
      [ '记录日期' ].concat(header1),
      [ '' ].concat(header2),
    ]);
    ws['!cols'] = wscols;
    ws['!merges'] = wsMerge;
    // const wb = XLSX.utils.book_new();
    // XLSX.utils.sheet_add_aoa(ws, finalResult, { origin: 'A3' });
    // XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    // // wsMerge.push(XLSX.utils.decode_range('B1:D1')) // 测试数据 仓库1模拟数据
    // XLSX.writeFile(wb, '测试表1.xlsx');
    await this.makeDataToExcel_new(finalResult, ws, '游戏下载详情');
  }


  async exportList_overview() {
    const result = await this.ctx.model.AnalyzeLog.aggregate([
      { $match: { category: { $in: [ '获得', '消费' ] } } },
      {
        $group: {
          _id: {
            day: { $dayOfYear: '$analyzeDate' },
          },
          totalGainAmount: { $sum: { $cond: [{ $gte: [ '$amount', 0 ] }, '$amount', 0 ] } },
          totalWithdrewCount: { $sum: { $cond: [{ $eq: [ '$category', '消费' ] }, 1, 0 ] } },
          totalWithdrewAmount: { $sum: { $cond: [{ $eq: [ '$category', '消费' ] }, '$amount', 0 ] } },
          activityUser: { $sum: 1 },
          deepUserCount: { $sum: { $cond: [{ $gte: [ '$totalAmount', '1000' ] }, 1, 0 ] } },
        },
      },
    ]);

    const result_deepCount = await this.ctx.model.AnalyzeLog.aggregate([
      { $match: { category: { $in: [ '获得' ] } } },
      {
        $group: {
          _id: {
            day: { $dayOfYear: '$analyzeDate' },
            tel_number: '$tel_number',
          },
          todayTotalAmount: { $sum: '$amount' },
        },
      },
      {
        $group: {
          _id: '$_id.day',
          todayDeepCount: { $sum: { $cond: [{ $gte: [ '$todayTotalAmount', 10000 ] }, 1, 0 ] } },
        },
      },
    ]);
    //
    // const c = await this.ctx.model.UserAccount.find({}, { Bcoins: 1 });
    // const deepUserCount = c.filter(e => e.Bcoins > 10000).length;


    const auditResult = await this.ctx.model.AuditUploadRecord.aggregate([
      { $match: { status: 2 } },
      { $group: {
        _id: { day: { $dayOfYear: '$updated_at' } },
        count: { $sum: 1 },
      } },
      { $project: {
        _id: 0,
        day: '$_id.day',
        count: 1,
      } },
    ]);
    const auditResultMap = new Map();
    for (const element of auditResult) {
      auditResultMap.set(element.day, element.count);
    }
    const resultArray = [];
    for (const element of result) {
      const tempObj = {
        日期: this.formatDayOfYear(element._id.day),
        总金币产出: element.totalGainAmount,
        总提现额: element.totalWithdrewAmount,
        总提现数: element.totalWithdrewCount,
        活跃用户数: element.activityUser,
        深度用户数: result_deepCount.find(e => e._id === element._id.day).todayDeepCount,
        总审核通过数: auditResultMap.get(element._id.day),
      };
      resultArray.push(tempObj);
    }
    const wsCols = [
      { wch: 25 },
      { wch: 20 },
      { wch: 15 },
      { wch: 10 },
      { wch: 10 },
      { wch: 20 },
      { wch: 40 },
    ];
    await this.makeJsonToExcel(resultArray, wsCols, '数据总览');
  }


  async exportList_userDetail() {
    const result = await this.ctx.model.AnalyzeLog.aggregate([
      { $match: { category: { $in: [ '获得', '消费' ] } } },
      {
        $group: {
          _id: {
            // category_2: '$category_2',
            tel_number: '$tel_number',
            analyzeDate: '$analyzeDate',
          },
          // census: { $sum: '$amount' },
          date: { $first: '$date_1' },
          nickName: { $first: '$nickName' },
          rewardTotalAmount: { $max: { $cond: [{ $eq: [ '$category_2', '返利' ] }, '$totalAmount', 0 ] } },
          gainTotalAmount: { $max: { $cond: [{ $eq: [ '$category_2', '自我收入' ] }, '$totalAmount', 0 ] } },
          gainCensus: { $sum: { $cond: [{ $and: [
            { $eq: [ '$category_2', '自我收入' ] },
            { $eq: [ '$category', '获得' ] },
          ] }, '$amount', 0 ] } },
          rewardCensus: { $sum: { $cond: [{ $eq: [ '$category_2', '返利' ] }, '$amount', 0 ] } },
          totalWithdrew: { $min: { $cond: [{ $eq: [ '$category', '消费' ] }, '$amount', null ] } },
        },
      },
      // {
      //   $group: {
      //     _id: {
      //       analyzeDate: '$_id.analyzeDate',
      //       tel_number: '$_id.tel_number',
      //       category_2: '$_id.category_2',
      //     },
      //     res: { $push: { census: '$census', category: '$_id.category', totalAmount: '$totalAmount' } },
      //     date: { $first: '$date' },
      //
      //   } },
      //
      // },
    ]);
    const nameBoard = result.map(e => e._id.tel_number);

    const userList = await this.ctx.model.UserAccount.find({ tel_number: { $in: nameBoard } }, { referrals: 1, tel_number: 1 });
    const tableData = [];
    for (const element of result) {
      // const getObj = element.res.find(e => e.category === '获得');
      const userObj = userList.find(e => e.tel_number === element._id.tel_number);
      const length = userObj ? userObj.referrals.length : 0;
      const tempObj = {
        日期: this.app.getFormatDateForJSON(element._id.analyzeDate),
        用户昵称: element.nickName,
        用户账号: element._id.tel_number,
        '当日金币获取(非邀请)': element.gainCensus,
        当日邀请返利渠道获取金币: element.rewardCensus,
        当日金币总产出: element.gainCensus + element.rewardCensus,
        '累计金币获取(非邀请)': element.gainTotalAmount,
        累计邀请人数: length,
        累计邀请返利金币获取: element.rewardTotalAmount,
        累计总金币获取: element.gainTotalAmount + element.rewardTotalAmount,
        累计提现: element.totalWithdrew ? element.totalWithdrew : 0,
        注册日期: this.app.getLocalTime(element.date),
      };
      tableData.push(tempObj);
    }
    //
    const wsCols = [
      { wch: 25 },
      { wch: 20 },
      { wch: 15 },
      { wch: 22 },
      { wch: 25 },
      { wch: 15 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 17 },
      { wch: 37 },
    ];
    await this.makeJsonToExcel(tableData, wsCols, '用户详细');
  }

  async exportList_gameDetail() {
    const wscols = [
      { wch: 20 },
    ];
    const gameNames = await this.ctx.model.GameEvent.aggregate([
      { $unwind: '$gameSetting' },
      { $project: {
        _id: 0,
        gameName: '$gameSetting.gameName',
      } },
      { $group: {
        _id: 0,
        gameNames: { $addToSet: '$gameName' },
      } },
    ]);

    const header1 = gameNames[0].gameNames;
    const gameList = Object.assign([], gameNames[0].gameNames);

    const wsMerge = [ XLSX.utils.decode_range('A1:A2') ];
    header1.map((res, idx, array) => {
      const hdMergeObj = {
        s: { r: 0 },
        e: { r: 0 },
      };
      if ((idx + 2) % 1 === 0) {
        array.splice(3 * idx + 1, 0, '', '');
        hdMergeObj.s.c = 3 * idx + 1;
        hdMergeObj.e.c = hdMergeObj.s.c + 2;
        wsMerge.push(hdMergeObj);
      }
      return res;
    });
    const keyArray = [];
    gameList.forEach(e => {
      keyArray.push(e + '-try');
      keyArray.push(e + '-A');
      keyArray.push(e + '-B');
    });

    const header2 = Array(gameList.length).fill('任务-试玩'); // .concat('库存数量');
    header2.map((res, idx, array) => {
      if ((idx + 2) % 1 === 0) {
        array.splice(3 * idx + 1, 0, '任务-A', '任务-B');
      }
      return res;
    });
    for (let i = 0; i < header2.length; i++) {
      wscols.push({ wch: 12 });
    }

    const ws = XLSX.utils.aoa_to_sheet([
      [ '记录日期' ].concat(header1),
      [ '' ].concat(header2),
    ]);
    ws['!cols'] = wscols;
    ws['!merges'] = wsMerge;
    let aggregateResult = await this.ctx.model.AuditUploadRecord.aggregate([
      // { $match: { name: '放置三国名将' } },
      { $group: {
        _id: {
          name: '$name',
          sub_title: '$sub_title',
          day: { $dayOfYear: '$created_at' },
        },
        play: { $addToSet: '$tel_number' },

      } },

      { $project: {
        _id: 0,
        dayList: 1,
        day: '$_id.day',
        key: { $concat: [ '$_id.name', '-', '$_id.sub_title' ] },
        valueArray: '$play',
      },
      },
      // { $match: { day: { $gte: '310' } } },
      { $group: {
        _id: '$day',
        arrayList: { $addToSet: { key: '$key', valueArray: '$valueArray' } },
      } },
    ]);

    aggregateResult = aggregateResult.sort((a, b) => { return -a._id + b._id; });
    const finalResultArray = [];
    for (const resultObj of aggregateResult) {
      const dataMap = new Map();
      let longestNumber = 0;
      for (const obj of resultObj.arrayList) {
        dataMap.set(obj.key, obj.valueArray);
        longestNumber = Math.max(longestNumber, obj.valueArray.length);
      }
      const countArray = Array(keyArray.length + 1).fill(0);
      countArray[0] = '单日计数';
      for (let index = 0; index < longestNumber; index++) {
        const columnArray = [];

        for (let nameKeyIndex = 0; nameKeyIndex < keyArray.length; nameKeyIndex++) {
          // if (nameKeyIndex === 0) {
          //   columnArray.push('!');
          // }
          const nameKey = keyArray[nameKeyIndex];
          const tempValueArray = dataMap.get(nameKey);
          if (tempValueArray && tempValueArray[index]) {
            columnArray.push(tempValueArray[index]);
            countArray[nameKeyIndex + 1] += 1;
          } else {
            columnArray.push('');
          }
        }
        finalResultArray.push([ this.formatDayOfYear(resultObj._id) ].concat(columnArray));
      }
      finalResultArray.push(countArray);
      // for (let index = 0; index < longestNumber; index++) {
      //   const tempArray = [];
      //   for (let nameKeyIndex = 0; nameKeyIndex < keyArray.length; nameKeyIndex++) {
      //     const nameKey = keyArray[nameKeyIndex];
      //     const tempValueArray = dataMap.get(nameKey);
      //     if (tempValueArray && (index <= tempValueArray.length - 1)) {
      //       tempArray.push(tempValueArray[index]);
      //       const count = mapX.get(nameKey) ? mapX.get(nameKey) : 0;
      //       mapX.set(nameKey, count + 1);
      //     } else {
      //       // tempArray.push(nameKey);
      //       // tempArray.push('');
      //     }
      //   }
      //   resultArray.push([ this.formatDayOfYear(resultObj._id) ].concat(tempArray));
      // }
      // resultArray.push(totalArray);
    }

    // ws.B2.s = {									// 为某个单元格设置单独样式
    //   font: {
    //     name: '宋体',
    //     sz: 100,
    //     bold: true,
    //     color: { rgb: '33FF33' },
    //   },
    //   alignment: { horizontal: 'center', vertical: 'center', wrap_text: true },
    //   fill: { bgcolor: { rgb: '33FF33' } },
    // };

    const wb = XLSX.utils.book_new();
    XLSX.utils.sheet_add_aoa(ws, finalResultArray, { origin: 'A3' });
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    // wsMerge.push(XLSX.utils.decode_range('B1:D1')) // 测试数据 仓库1模拟数据
    XLSX.writeFile(wb, '测试表1.xlsx');
    await this.makeDataToExcel_new(finalResultArray, ws, '游戏详情');

  }
  async makeDataToExcel_new(resultData, ws, sheetName) {
    const wb = XLSX.utils.book_new();
    XLSX.utils.sheet_add_aoa(ws, resultData, { origin: 'A3' });
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    const fileName = path.resolve(__dirname, `../public/file/${sheetName}-${this.ctx.app.getLocalTimeForFileName(new Date())}.xlsx`);
    XLSX.writeFile(wb, fileName);
    return fileName;
  }

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
          uuid: { $first: '$uuid' },
        },
      },
    ]);
    return users;
  }
  // async getJsonToExcel(day) {
  //   const app = this.ctx.app;
  //   const resultData = [];
  //   const users = await this.getUserList(day, {}, null);
  //   users.forEach(user => {
  //     const element = {};
  //     // if (user.tel_number !== '13602012967') { return; }
  //     element.用户昵称 = user.nickName;
  //     element.用户账号 = user.tel_number;
  //     element.今日收入 = !this.ctx.helper.isEmpty(user.todayIncoming) ? user.todayIncoming : 0;
  //     element.金币余额 = app.decrypt(user.Bcoins);
  //     element.注册时间 = app.getLocalTimeForFileName(user.created_at);
  //     resultData.push(element);
  //   });
  //   const rowInfo = [
  //     { hpx: 30 },
  //   ];
  //   const wsCols = [
  //     { wch: 25 },
  //     { wch: 20 },
  //     { wch: 10 },
  //     { wch: 10 },
  //     { wch: 10 },
  //   ];
  //   const workbook = XLSX.utils.book_new();
  //   const tempRowInfo = Array.from(rowInfo);
  //   tempRowInfo.push({ hpx: 20 });
  //   const worksheet = await XLSX.utils.json_to_sheet(resultData);
  //   worksheet['!cols'] = wsCols;
  //   worksheet['!rows'] = tempRowInfo;
  //   XLSX.utils.book_append_sheet(workbook, worksheet, '用户信息列表');
  //   const fileName = path.resolve(__dirname, `../public/file/${this.ctx.app.getLocalTimeForFileName(new Date())}.xlsx`);
  //   XLSX.writeFile(workbook, fileName);
  //   return fileName;
  // }
  async makeJsonToExcel(resultData, wsCols, sheetName) {
    const workbook = XLSX.utils.book_new();
    const rowInfo = [
      { hpx: 30 },
    ];
    const tempRowInfo = Array.from(rowInfo);
    tempRowInfo.push({ hpx: 20 });
    const worksheet = await XLSX.utils.json_to_sheet(resultData);
    worksheet['!cols'] = wsCols;
    worksheet['!rows'] = tempRowInfo;
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    const fileName = path.resolve(__dirname, `../public/file/${sheetName}-${this.ctx.app.getLocalTimeForFileName(new Date())}.xlsx`);
    XLSX.writeFile(workbook, fileName);
    return fileName;
  }


  // async gameEventDetail() {
  //   const thisDay = this.getTimeQueryByPeriod(day);
  //   await this.ctx.model.GameEvent.aggregate([
  //
  //
  //   ]);
  //
  //
  // }

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
