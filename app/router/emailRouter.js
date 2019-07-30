module.exports = app => {
    const {router, controller} = app;
    router.get('/mail', controller.emailController.sendEmail);
    router.get('/sms', controller.smsController.sendSmsMessage);
};