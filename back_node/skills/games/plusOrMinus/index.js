const text = require("./text.json");
module.exports.data = text;

module.exports.execute = ({ lang, userData }) => {
  //Lang unknown
  if (!text.response[lang]) return { text: text.error };

  const randomNumber = Math.floor(Math.random() * 99) + 1;
  const session = { randomNumber };
  return {
    text: text.response[lang].startGame,
    session,
    shortAnswerExpected: true,
  };
};
