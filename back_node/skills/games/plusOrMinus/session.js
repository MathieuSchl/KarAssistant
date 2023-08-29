const replaceVariables =
  require("../../../utils/replaceVariables").replaceVariables;
const text = require("./text.json");
module.exports.data = text;

module.exports.execute = ({ query, lang, data }) => {
  if (/^\d+?$/.test(query)) {
    //Lang unknown
    if (!text.response[lang]) return { text: text.error + "/session" };

    const userValue = parseInt(query);
    const gameTarget = data.randomNumber;
    const textResult =
      userValue === gameTarget
        ? text.response[lang].correctValue
        : userValue < gameTarget
        ? text.response[lang].greaterValue
        : text.response[lang].smallerValue;

    return {
      text: replaceVariables(textResult, { userValue, gameTarget }),
      data: userValue !== gameTarget ? data : null,
    };
  }
};
