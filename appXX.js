'use strict';
//const LocalStrategy = require('passport-local').Strategy;
// const Logger = require('egg-logger').Logger;
// const FileTransport = require('egg-logger').FileTransport;
const ConsoleTransport = require('egg-logger').ConsoleTransport;
const EventEmitter = require('events');
let RemoteErrorTransport = require(`./app/logging/RemoteErrorTransport`)
module.exports = app => {
    // 挂载 strategy

    // logger.set('file', new FileTransport({
    //     file: '/path/to/file',
    //     level: 'INFO',
    // }));




};