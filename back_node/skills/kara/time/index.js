const isValidTimeZone =
  require("../../../utils/isValidTimeZone").isValidTimeZone;
const moment = require("moment-timezone");
const text = require("./text.json");
module.exports.data = text;

module.exports.execute = ({ lang, timeZone }) => {
  //ISO 639-1 https://www.andiamo.co.uk/resources/iso-language-codes/
  //TimeZone  https://en.wikipedia.org/wiki/List_of_tz_database_time_zones

  //Lang unknown
  if (!text.response[lang]) return { text: text.error };

  const resultTimeZone = isValidTimeZone(timeZone) ? timeZone : "Europe/London";
  const momentNow = moment().tz(resultTimeZone);
  momentNow.locale(lang);
  return {
    text: momentNow.format(text.response[lang].time),
  };
};
