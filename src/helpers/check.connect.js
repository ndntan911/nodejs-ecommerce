"use strict";

const mongoose = require("mongoose");
const os = require("os");

const _SECONDS = 5;

// count connection
const countConnect = () => {
  const numConnection = mongoose.connections.length;
  console.log(`Number of connections: ${numConnection}`);
};

// check over load
const checkOverload = () => {
  // monitor every 5 seconds
  setInterval(() => {
    const numConnection = mongoose.connections.length;
    const numCore = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;

    // example maximum number of connections based on number of cores
    const maxConnections = numCore * 5;

    console.log(`Number of connections: ${numConnection}`);
    console.log(`Memory usage: ${memoryUsage / 1024 / 1024} MB`);

    if (numConnection > maxConnections) {
      console.log(`Overload: ${numConnection} connections`);
    }
  }, _SECONDS * 1000);
};

module.exports = { countConnect, checkOverload };
