const text = require("./text.json");
module.exports.data = text;

module.exports.execute = ({ lang }) => {
  //Lang unknown
  if (!text.response[lang]) return { text: text.error };

  const availableResults = text.response[lang].results;
  const result =
    availableResults[Math.floor(Math.random() * availableResults.length)];

  return {
    text: result,
  };
};
