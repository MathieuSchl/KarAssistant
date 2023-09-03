const fs = require("fs");

module.exports.prepareFolders = () => {
  //Create files/folders if not exist
  if (!fs.existsSync(__dirname + "/../logs")) fs.mkdirSync(__dirname + "/../logs");

  if (!fs.existsSync(__dirname + "/../data")) fs.mkdirSync(__dirname + "/../data");
  if (!fs.existsSync(__dirname + "/../data/clients")) fs.mkdirSync(__dirname + "/../data/clients");
};
