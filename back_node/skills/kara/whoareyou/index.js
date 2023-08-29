const text = require("./text.json");
module.exports.data = text;

module.exports.execute = (data) => {
  //Lang unknown
  if(!text.response[data.lang]) return { text: text.error };
  
  return {
    text: text.response[data.lang].whoareyou
  }
};
