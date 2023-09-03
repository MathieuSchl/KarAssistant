const text = require("./text.json");
module.exports.data = text;

module.exports.execute = ({ lang }) => {
  //Lang unknown
  if (!text.response[lang]) return { text: text.error };

  return {
    text: text.response[lang].whoareyou,
  };
};
