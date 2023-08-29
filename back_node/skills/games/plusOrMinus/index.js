const text = require("./text.json");
module.exports.data = text;

module.exports.execute = (data) => {
  //Lang unknown
  if(!text.response[data.lang]) return { text: text.error };

  const randomNumber = Math.floor(Math.random() * 100);
  const resData = { randomNumber };
  return {
    text: text.response[data.lang].startGame,
    data: resData
  }
};
