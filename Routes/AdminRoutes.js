const express = require("express");
const router = express.Router();
const { adminOnly } = require("../Middlewares/Auth");
const {adminReports} = require("../Controllers/AdminRoutesController");


//(Protect Route) : Admin Reports
router.post("/", adminOnly, adminReports);

module.exports = router;
