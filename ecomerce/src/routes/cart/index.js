"use strict";

const express = require("express");
const cartController = require("../../controllers/cart.controller");
const asyncHandler = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");
const router = express.Router();

router.post("/", asyncHandler(cartController.addToCart));
router.delete("/", asyncHandler(cartController.deleteUserCart));
router.put("/", asyncHandler(cartController.updateCart));
router.get("/", asyncHandler(cartController.getListUserCart));

router.use(authentication);

module.exports = router;
