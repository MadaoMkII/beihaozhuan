`use strict`;
module.exports = app => {
    const {router, controller} = app;
    router.post('/good/create', controller.goodController.creatGood);
    router.get('/good/getAll', controller.goodController.getAll);
};
