const AccessService = require("../services/access.service");
const { Created, SuccessResponse } = require("../core/success.response");

class AccessController {
  handleRefreshToken = async (req, res, next) => {
    return new SuccessResponse({
      message: "Token refreshed successfully",
      metadata: await AccessService.handleRefreshToken(req.body.refreshToken),
    }).send(res);
  };

  logout = async (req, res, next) => {
    console.log("req.keyStore", req.keyStore);
    return new SuccessResponse({
      message: "User logged out successfully",
      metadata: await AccessService.logout({ keyStore: req.keyStore }),
    }).send(res);
  };

  login = async (req, res, next) => {
    return new SuccessResponse({
      message: "User logged in successfully",
      metadata: await AccessService.login(req.body),
    }).send(res);
  };

  signUp = async (req, res, next) => {
    return new Created({
      message: "User registered successfully",
      metadata: await AccessService.signUp(req.body),
    }).send(res);
  };
}

module.exports = new AccessController();
