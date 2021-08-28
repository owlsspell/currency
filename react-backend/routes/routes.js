const Router = require("express");
const autoRouter = new Router();
const carsController = require("../controller/controler");

autoRouter.get("/getAllOrders", carsController.getAllOrders);

autoRouter.get("/getCountModel", carsController.getCountModel);

autoRouter.get("/getCountBrand", carsController.getCountBrand);

autoRouter.get("/getSumModel", carsController.getSumModel);

autoRouter.get("/getSumBrands", carsController.getSumBrands);

autoRouter.get("/getProfitable", carsController.getProfitable);

autoRouter.get("/getNotProfitable", carsController.getNotProfitable);

module.exports = autoRouter;
