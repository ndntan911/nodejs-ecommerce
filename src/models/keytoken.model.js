"use strict";

const { model, Schema, Types } = require("mongoose");

const KEYTOKEN_COLLECTION_NAME = "KeyTokens";
const KEYTOKEN_DOCUMENT_NAME = "KeyToken";

const keyTokenSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Shop",
    },
    publicKey: {
      type: String,
      required: true,
    },
    privateKey: {
      type: String,
      required: true,
    },
    refreshTokensUsed: {
      type: Array,
      default: [],
    },
    refreshToken: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: KEYTOKEN_COLLECTION_NAME,
  },
);

module.exports = model(KEYTOKEN_DOCUMENT_NAME, keyTokenSchema);
