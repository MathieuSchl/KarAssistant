const fs = require("fs");

module.exports.prepareFolders = () => {
  //Create files/folders if not exist
  if (!fs.existsSync(__dirname + "/../logs")) fs.mkdirSync(__dirname + "/../logs");
  if (!fs.existsSync(__dirname + "/../data")) fs.mkdirSync(__dirname + "/../data");
  if (!fs.existsSync(__dirname + "/../data/sessions")) fs.mkdirSync(__dirname + "/../data/sessions");
  if (!fs.existsSync(__dirname + "/../data/querriesClose.json"))
    fs.writeFileSync(__dirname + "/../data/querriesClose.json", JSON.stringify([]));
    if (!fs.existsSync(__dirname + "/../data/vectors.json"))
      fs.writeFileSync(__dirname + "/../data/vectors.json", JSON.stringify({}));
};
