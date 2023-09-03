const moment = require("moment-timezone");

module.exports.isValidTimeZone = (timezone) => {
  return moment.tz.zone(timezone) != null;
};
