// const path = require('path');
// const xlsxStyle = require('just2lab-xlsx-style');
// const xlsx = require('xlsx'),
//   { utils } = xlsx;
//
// const getLocationByIndex = (x, y) => {
//   if (y === undefined) return String.fromCharCode(97 + Number(x)).toUpperCase();
//   return String.fromCharCode(97 + Number(x)).toUpperCase() + String(y);
// };
// const workSheet =
//     utils.json_to_sheet([
//       { A: '会议名称', B: 'BOX' },
//       { A: '会议时间', B: '2021-01-18 14:00:00 - 2021-01-18 15:00:00' },
//       { A: '会议简述', B: 'title' },
//       { A: '参会人员', B: '1/1' },
//       { A: '出勤率', B: '100%' },
//       { A: '', B: '' },
//       { A: '序号', B: '姓名', C: '签到时间', D: '状态', E: '请假原因' },
//       { A: '1', B: '邓勇', C: '2021/1/18  14:24:18', D: '已签到', E: '请假原因' },
//     ], {
//       header: [ ],
//       skipHeader: true, // 跳过上面的标题行
//     });
// const wscols = [
//   { wch: 8 },
//   { wch: 24 },
//   { wch: 25 },
//   { wch: 14 },
//   { wch: 14 },
// ];
// const wsrows = [
//   { hpt: 26 }, // row 1 sets to the height of 12 in points
//   { hpx: 48 }, // row 2 sets to the height of 16 in pixels
// ];
//
// workSheet['!cols'] = wscols;
// workSheet['!rows'] = wsrows;
//
//
// for (const key in workSheet) {
//   if (!workSheet.hasOwnProperty(key) || key.startsWith('!')) { continue; }
//   workSheet[key].s = {
//     // fill: {
//     //   fgColor: { rgb: 'FFA3F4B1' }, // 添加背景色
//     // },
//     font: {
//       name: '宋体', // 字体
//       sz: 11, // 字体大小
//       bold: false, // 加粗
//     },
//     alignment: {
//       // / 自动换行
//       wrapText: 1,
//       // 居中
//       horizontal: 'center',
//       vertical: 'center',
//       indent: 0,
//     },
//     // border: {
//     //   // 下划线
//     //   bottom: {
//     //     style: 'thin',
//     //     color: 'FF000000',
//     //   },
//     // },
//   };
//   if (Number(key.charAt(1)) === 7) {
//     workSheet[key].s.fill = {
//       fgColor: { rgb: '96CEF2' },
//     };
//   }
//   if (key.indexOf('A') !== -1 && Number(key.charAt(1)) < 6) {
//     workSheet[key].s.fill = {
//       fgColor: { rgb: 'DFE4E7' },
//     };
//     workSheet[key].s.border = {
//       top: {
//         style: 'thin',
//         color: 'FF000000',
//       },
//       bottom: {
//         style: 'thin',
//         color: 'FF000000',
//       } };
//     workSheet[key].s.font = {
//       name: '宋体', // 字体
//       sz: 10, // 字体大小
//       bold: true, // 加粗}
//     };
//   } else {
//
//   }
//   if (key.indexOf('7') !== -1) {
//     workSheet[key].s.border = {
//       top: {
//         style: 'thin',
//         color: 'FF000000',
//       },
//       bottom: {
//         style: 'thin',
//         color: 'FF000000',
//       } };
//   }
//
//
// }
// console.log(workSheet);
// const wb = utils.book_new();
//
// xlsx.utils.book_append_sheet(wb, workSheet, 'dog');
// const fileName = path.resolve(__dirname, '../app/public/file/test.xlsx');
// xlsxStyle.writeFile(wb, fileName);
const a = null;
const b = () => { console.log(2); };
a && b();
