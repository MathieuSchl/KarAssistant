module.exports.startApi = (app) => {
  require("./query").start(app);
};
