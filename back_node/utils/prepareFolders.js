const fs = require("fs");

module.exports.prepareFolders = () => {
  //Create files/folders if not exist
  if (!fs.existsSync(__dirname + "/../data")) fs.mkdirSync(__dirname + "/../data");
  if (!fs.existsSync(__dirname + "/../data/querriesClose.json"))
    fs.writeFileSync(__dirname + "/../data/querriesClose.json", JSON.stringify([]));
};