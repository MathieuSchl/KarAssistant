async function start() {
  const { Client, GatewayIntentBits, Partials } = require("discord.js");
  const fs = require("fs");
  require("dotenv").config();

  const TOKEN = process.env.DISCORD_TOKEN;
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildPresences,
      GatewayIntentBits.DirectMessages,
    ],
    partials: [
      Partials.Channel, // Required to receive DMs
    ],
  });

  require("./utils/prepareFolders").prepareFolders();

  fs.readdir(__dirname + "/events/", (err, files) => {
    files.forEach((file) => {
      if (fs.existsSync(__dirname + "/events/" + file)) require(__dirname + "/events/" + file).run(client);
    });
  });

  client.login(TOKEN).then(() => {});
}

start();
