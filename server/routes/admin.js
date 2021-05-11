const express = require("express");
const { auth } = require("../firebase");

const router = express.Router();

// middlewares
const { authCheck, adminCheck } = require("../middlewares/auth");

const { orders, orderStatus } = require("../controllers/admin");


// const {userInfo} = require("../controllers/admin"); //!

// routes
router.get("/admin/orders", authCheck, adminCheck, orders);

// router.get("/admin/userInfo", authCheck, adminCheck, userInfo); //!

router.put("/admin/order-status", authCheck, adminCheck, orderStatus);

module.exports = router;