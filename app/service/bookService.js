'use strict'
const Service = require('egg').Service;

class bookService extends Service {
    async postBook() {

        return {name: "helloworld"}
    }

}
module.exports = bookService;