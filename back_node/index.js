const express = require("express");
const app = express();
require("dotenv").config();
const use = require("./universalSentenceEncoder/index");
const port = process.env.PORT ? process.env.PORT : 3000;

require("./api/index").startApi(app);

if (process.env.SHOWSWAGGER === "true") {
  const swaggerUI = require("swagger-ui-express");
  const swaggerJsDoc = require("swagger-jsdoc");
  const servers = [
    {
      url: `http://localhost:${port}`,
    },
  ];
  if (process.env.PROD_URL)
    servers.push({
      url: process.envPROD_URL,
    });
  const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "KarAssistant API",
        version: require("./package.json").version,
        description:
          "Hello and welcome to the API documentation of the KarAssistant.\n" +
          "This project is an personnal assistant. You can ask a question and Kara will answer you\n",
      },
      servers,
    },
    apis: ["./api/*.js", "./api/*/*.js", "./api/*/*/*.js"],
  };

  const specs = swaggerJsDoc(options);

  app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
}

async function start() {
  await use.start();
  app.listen(port);
  console.log(`\n\x1b[33mApp is listening port : ${port}\x1b[0m`);
  if (process.env.SHOWSWAGGER) console.log(`Documentation available here : http://localhost:${port}/api-docs\n`);
}

start();
