'use strict';
module.exports = app => {
  const { router, controller } = app;
  const { authController } = controller;
  router.get('/user/getReport2nd', authController.getReport2nd);
};
