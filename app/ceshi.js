'use strict';
const toQueryString = obj => {
  return Object.keys(obj)
    .filter(key => key !== 'sign' && obj[key] !== void 0 && obj[key] !== '')
    .sort()
    .map(key => key + '=' + obj[key])
    .join('&');
};

const getSign = (params, type = 'MD5') => {
  const str = toQueryString(params) + '&key=beihaozhuan01';
  let signedStr = '';
  switch (type) {
    case 'MD5':
      signedStr = String(require('md5')(str))
        .toUpperCase();
      break;
    case 'SHA1':
      signedStr = String(require('sha1')(str))
        .toUpperCase();
      break;
    default:
      throw new Error('signType Error');
  }
  return [ str, signedStr ];
};
const obj = {
  noncestr: 'noncestr',
  timestamp: 33112313213,
  type: '签到任务',
  tel_number: '15620304097',
}
;
console.log(getSign(obj)[0]);
console.log(getSign(obj)[1]);
console.log(new Date(33112313213));
