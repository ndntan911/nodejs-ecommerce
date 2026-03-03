const dev = {
  app: {
    port: process.env.DEV_APP_PORT,
  },
  db: {
    host: process.env.DEV_DB_HOST || "localhost",
    port: process.env.DEV_DB_PORT || "27017",
    name: process.env.DEV_DB_NAME || "shopDEV",
    username: process.env.DEV_DB_USERNAME || "admin",
    password: process.env.DEV_DB_PASSWORD || "password123",
  },
};

const pro = {
  app: {
    port: process.env.PRO_APP_PORT,
  },
  db: {
    host: process.env.PRO_DB_HOST || "localhost",
    port: process.env.PRO_DB_PORT || "27017",
    name: process.env.PRO_DB_NAME || "shopPRO",
    username: process.env.PRO_DB_USERNAME || "admin",
    password: process.env.PRO_DB_PASSWORD || "password123",
  },
};

const config = {
  dev,
  pro,
};
const env = process.env.NODE_ENV || "dev";

module.exports = config[env];
