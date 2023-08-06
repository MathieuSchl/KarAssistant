const use = require("../universalSentenceEncoder/index");

module.exports.start = (app) => {
  app.get("/api/query", async function (req, res) {
    const result = await use.query(req.query.query.toLowerCase());
    res.json(result);
  });
};
