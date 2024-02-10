const cron = require("node-cron");
const gatherData = require("../utils/wheather/skiinfo").gatherData;

async function action() {
  await gatherData();
}

/* c8 ignore start */
module.exports.start = () => {
  action();
  cron
    .schedule("56 */4 * * *", () => {
      action();
    })
    .start();
};
/* c8 ignore stop */
