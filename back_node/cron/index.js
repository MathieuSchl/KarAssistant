module.exports.startCron = (app) => {
  require("./garbageSessionCollector").start(app);
  require("./debanIpAddress").start(app);
};
