const isValidTimeZone =
  require("../../../utils/isValidTimeZone").isValidTimeZone;
const moment = require("moment-timezone");
const text = require("./text.json");
module.exports.data = text;

module.exports.execute = (data) => {
  //ISO 639-1 https://www.andiamo.co.uk/resources/iso-language-codes/
  //TimeZone  https://en.wikipedia.org/wiki/List_of_tz_database_time_zones

  //Lang unknown
  if (!text.response[data.lang]) return { text: text.error };

  const timeZone = isValidTimeZone(data.timeZone)
    ? data.timeZone
    : "Europe/London";
  const momentNow = moment().tz(timeZone);
  momentNow.locale(data.lang);
  return {
    text: momentNow.format(text.response[data.lang].time),
  };
};
