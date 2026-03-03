const keyTokenModel = require("../models/keytoken.model");

class KeyTokenService {
  static createKeyToken = async ({ userId, publicKey, privateKey }) => {
    try {
      const token = await keyTokenModel.create({
        user: userId,
        publicKey,
        privateKey,
      });

      return token ? publicKey : null;
    } catch (error) {
      return error;
    }
  };
}

module.exports = KeyTokenService;
