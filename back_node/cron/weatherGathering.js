const cron = require("node-cron");
const puppeteer = require("puppeteer");
const gatherData = require("../utils/wheather/skiinfo").gatherData;

async function action() {
  const browser = await puppeteer.launch({
    pipe: true,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage", "--single-process"],
  });

  await gatherData({ browser });

  console.log("Ski ready");
  await browser.close();
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
