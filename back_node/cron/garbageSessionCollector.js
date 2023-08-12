const cron = require("node-cron");
const fs = require("fs");
const oneDayInMilliseconds = 24 * 60 * 60 * 1000;

module.exports.start = (app) => {
  cron
    .schedule("*/5 * * * * *", () => {
      const actualDate = new Date();
      const elements = fs.readdirSync(__dirname + "/../data/sessions/");
      for (const element of elements) {
        const dataRead = fs.readFileSync(__dirname + "/../data/sessions/" + element, "utf8");
        const content = JSON.parse(dataRead);
        const fileDate = new Date(content.date);
        const timeDifference = actualDate - fileDate;
        if (timeDifference > oneDayInMilliseconds) {
          fs.unlinkSync(__dirname + "/../data/sessions/" + element);
        }
      }
    })
    .start();
};
