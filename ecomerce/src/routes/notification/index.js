"use strict";

const express = require("express");
const notificationController = require("../../controllers/notification.controller.js");
const asyncHandler = require("../../helpers/asyncHandler");
const router = express.Router();

router.get("/", asyncHandler(notificationController.listNotiByUser));

module.exports = router;
