"use strict";

const express = require("express");
const commentController = require("../../controllers/comment.controller");
const asyncHandler = require("../../helpers/asyncHandler");
const router = express.Router();

router.post("/", asyncHandler(commentController.createComment));
router.get("/", asyncHandler(commentController.getCommentsByParentId));
router.delete("/", asyncHandler(commentController.deleteComment));

module.exports = router;
