const { findById } = require("../services/apikey.service");

const HEADER = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
};

const apiKey = async (req, res, next) => {
  try {
    const key = req.headers[HEADER.API_KEY]?.toString();
    if (!key) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // check objkey
    const objKey = await findById(key);
    if (!objKey) {
      return res.status(403).json({ message: "Forbidden" });
    }

    req.objKey = objKey;
    next();
  } catch (error) {}
};

const permission = (permission) => {
  return (req, res, next) => {
    // check permission
    if (!req.objKey.permissions) {
      return res.status(403).json({ message: "Permission denied" });
    }

    if (!req.objKey.permissions.includes(permission)) {
      return res.status(403).json({ message: "Permission denied" });
    }

    next();
  };
};

const asyncHandler = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

module.exports = {
  apiKey,
  permission,
  asyncHandler,
};
