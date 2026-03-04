"use strict";

const express = require("express");
const productController = require("../../controllers/product.controller");
const asyncHandler = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");
const router = express.Router();

router.get(
  "/search/:keySearch",
  asyncHandler(productController.getListSearchProduct),
);
router.get("", asyncHandler(productController.findAllProducts));
router.get("/:id", asyncHandler(productController.findProduct));

// authentication
router.use(authentication);

router.post("", asyncHandler(productController.createProduct));
router.patch("/:id", asyncHandler(productController.updateProduct));
router.post(
  "/publish/:id",
  asyncHandler(productController.publishProductByShop),
);
router.post(
  "/unpublish/:id",
  asyncHandler(productController.unPublishProductByShop),
);

router.get("/drafts", asyncHandler(productController.getAllDraftsForShop));
router.get(
  "/published",
  asyncHandler(productController.getAllPublishedForShop),
);

module.exports = router;
