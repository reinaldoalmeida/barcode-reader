const express = require("express");

const IndexController = require("./controllers/IndexController");
const BarCodeController = require("./controllers/BarCodeController");

const routes = express.Router();

routes.get("/", IndexController.show);
routes.get("/barcode", BarCodeController.show);

module.exports = routes;
