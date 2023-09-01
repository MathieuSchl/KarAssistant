module.exports.startApi = (app) => {
  require("./query").start(app);
  require("./client/client").start(app);
};
