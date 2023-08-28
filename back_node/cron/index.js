module.exports.startCron = (app) => {
  require("./garbageSessionCollector").start(app);
};
