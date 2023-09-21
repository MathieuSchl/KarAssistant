const { Events } = require("discord.js");
let timeout = 1000;

function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

async function activity(client) {
  const randomActivity = randomIntFromInterval(0, 25);
  switch (randomActivity) {
    case 0:
      client.user.setActivity("My name is Karoline");
      timeout = randomIntFromInterval(60, 120) * 1000;
      break;

    case 1:
      client.user.setActivity("My name is Glados");
      timeout = randomIntFromInterval(60, 120) * 1000;
      break;

    case 2:
      client.user.setActivity("My name is Connor");
      timeout = randomIntFromInterval(60, 120) * 1000;
      break;

    case 3:
      client.user.setActivity("My name is Marcus");
      timeout = randomIntFromInterval(60, 120) * 1000;
      break;

    case 4:
      client.user.setActivity("My name is Car (Tut tut)");
      timeout = randomIntFromInterval(60, 120) * 1000;
      break;

    default:
      client.user.setActivity("My name is Kara");
      timeout = randomIntFromInterval(300, 3600) * 1000;
      break;
  }
  return;
}

module.exports.run = async (client) => {
  client.on(Events.ClientReady, async () => {
    console.log(`Logged in as ${client.user.tag} !\n`);

    await activity(client);
    while (true) {
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, timeout);
      });
      await activity(client);
    }
  });
};
