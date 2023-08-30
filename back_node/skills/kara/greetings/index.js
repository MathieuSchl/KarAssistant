const text = require("./text.json");
module.exports.data = text;

module.exports.execute = (data) => {
  //Lang unknown
  if (!text.response[data.lang]) return { text: text.error };

  const availableResults = text.response[data.lang].results;
  const result =
    availableResults[Math.floor(Math.random() * availableResults.length)];

  return {
    text: result,
  };
};
