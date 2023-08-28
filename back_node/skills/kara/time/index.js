const isValidTimeZone = require("../../../utils/isValidTimeZone").isValidTimeZone;
const moment = require('moment-timezone');
module.exports.data = require("./text.json");

module.exports.execute = (data) => {
  //ISO 639-1 https://www.andiamo.co.uk/resources/iso-language-codes/
  //TimeZone  https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
  const timeZone = isValidTimeZone(data.timeZone) ? data.timeZone : "Europe/London";
  const momentNow = moment().tz(timeZone)
  switch (data.lang) {
    case "en":
      return { text: momentNow.format("[It is] hh:mm a") };

    case "fr":
      return { text: momentNow.format("[Il est] HH [heures] mm") };

    default:
      return { text: `Undefined language for time` };
  }
};
