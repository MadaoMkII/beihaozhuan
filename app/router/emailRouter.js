`use strict`;
module.exports = app => {
    const {router, controller} = app;
    router.get('/mail', controller.emailController.sendEmail);
    // router.get('/sms', controller.smsController.sendSmsMessage);
    router.post('/verify/sendVerifySmsMessage', controller.smsController.sendVerifySmsMessage);
    router.post('/verify/smsLoginVerifyCode', controller.smsController.sendLoginVerifySmsMessage);
    router.post('/verify/sendFindPasswordBackSmsMessage', controller.smsController.sendfindPasswordBackSmsMessage);
    router.post('/verify/verifyFpbCode', controller.smsController.verifyfpbCode);
};
