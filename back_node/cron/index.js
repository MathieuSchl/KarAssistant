module.exports.startCron = (app) => {
  require("./garbageFilesCollector").start(app);
  require("./debanIpAddress").start(app);
  require("./weatherGathering").start(app);
};
