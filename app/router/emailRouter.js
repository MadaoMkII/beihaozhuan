module.exports = app => {
    const {router, controller} = app;
    router.get('/mail', controller.emailController.sendEmail);
    router.get('/sms', controller.smsController.sendSmsMessage);
    router.post('/sendVerifySmsMessage', controller.smsController.sendVerifySmsMessage);
    router.post('/sendVerifySmsMessage', controller.smsController.sendVerifySmsMessage);
};