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
    refreshToken: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
    collection: KEYTOKEN_COLLECTION_NAME,
  },
);

module.exports = model(KEYTOKEN_DOCUMENT_NAME, keyTokenSchema);
