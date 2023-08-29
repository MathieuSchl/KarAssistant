const sha1 = require("crypto-js/sha1");
const fs = require("fs");

module.exports.generateToken = generateToken;
function generateToken() {
  const dateTime = `${new Date().getTime()} `;

  const array = dateTime.split("");
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  const dateTimeShuffled = array.join("");
  const token = sha1(dateTimeShuffled).toString();
  if (fs.existsSync(__dirname + "/../data/sessions/" + token + ".json"))
    return generateToken();
  return token;
}
