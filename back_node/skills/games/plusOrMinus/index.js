const text = require("./text.json");
module.exports.data = text;

module.exports.execute = ({ lang }) => {
  //Lang unknown
  if (!text.response[lang]) return { text: text.error };

  const randomNumber = Math.floor(Math.random() * 100);
  const resData = { randomNumber };
  return {
    text: text.response[lang].startGame,
    shortAnswerExpected: true,
    data: resData,
  };
};
