module.exports.startApi = (app) => {
  require("./query").start(app);
  require("./user/user").start(app);
};
