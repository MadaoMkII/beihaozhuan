'use strict';
const {Service} = require('egg');
let {DateTime} = require('luxon');
let XLSX = require(`xlsx`);
const fs = require('fs');
const path = require('path');

class excelService extends Service {
    async createExcel(dataArray) {
        let workbook = XLSX.utils.book_new();
        let rowInfo = [
            {hpx: 30}
        ];
        let finalDataArray = [];
        for (let element of dataArray) {
            let tempElement = {};
            element = element[`_doc`];

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

            finalDataArray.push(tempElement)
        }

        let wsCols = [
            {wch: 20},
            {wch: 18},
            {wch: 12},
            {wch: 20},
            {wch: 9},
            {wch: 9},
            {wch: 17},
            {wch: 21},
            {wch: 25},
            {wch: 25},
            {wch: 20}
        ];

        let tempRowInfo = Array.from(rowInfo);
        tempRowInfo.push({hpx: 20});
        let worksheet = await XLSX.utils.json_to_sheet(finalDataArray);
        worksheet['!cols'] = wsCols;
        worksheet['!rows'] = tempRowInfo;
        XLSX.utils.book_append_sheet(workbook, worksheet, `商品订单列表`);

        let fileName =  path.resolve(__dirname, `../public/file/${this.ctx.app.getLocalTimeForFileName(new Date())}.xlsx`);
        XLSX.writeFile(workbook, fileName);
        return fileName;
    }


}

module.exports = excelService;