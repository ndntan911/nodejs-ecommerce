"use strict";

const express = require("express");
const uploadController = require("../../controllers/upload.controller");
const asyncHandler = require("../../helpers/asyncHandler");
const { uploadDisk, uploadMemory } = require("../../configs/multer.config");
const router = express.Router();

router.post("/product", asyncHandler(uploadController.uploadImageFromUrl));
router.post("/product/thumb", uploadDisk.single('file'), asyncHandler(uploadController.uploadImageFromLocal));

// s3
router.post("/product/s3", uploadMemory.single('file'), asyncHandler(uploadController.uploadImageFromLocalS3));

module.exports = router;
