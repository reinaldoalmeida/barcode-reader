const express = require("express");
const BarCodeController = require("./controllers/BarCodeController");

const routes = express.Router();

routes.post("/barcode", BarCodeController.show);

module.exports = routes;
