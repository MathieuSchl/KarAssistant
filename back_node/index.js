const express = require("express");
const use = require("./universalSentenceEncoder/index");
const app = express();

require("./api/index").startApi(app);

async function start() {
  await use.start();
  app.listen(3000);
  console.log("\n\x1b[33mApp is listening port : 3000\x1b[0m\n");
}

start();
