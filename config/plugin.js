'use strict';

/** @type Egg.EggPlugin */
exports.mongoose = {
  enable: true,
  package: 'egg-mongoose',
};
exports.passport = {
  enable: true,
  package: 'egg-passport',
};
exports.passportLocal = {
  enable: true,
  package: 'egg-passport-local',
};
exports.cors = {
  enable: true,
  package: 'egg-cors',
};
exports.aop = {
  enable: true,
  package: 'egg-aop',
};
exports.oss = {
  enable: true,
  package: 'egg-oss',
};
exports.ejs = {
  enable: true,
  package: 'egg-view-ejs',
};
exports.validatePlus = {
  enable: true,
  package: 'egg-validate-plus',
};
exports.alinode = {
  enable: process.platform !== 'win32',
  package: 'egg-alinode',
};
exports.downloader = {
  enable: true,
  package: 'egg-downloader',
};
