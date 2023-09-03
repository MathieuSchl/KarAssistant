const { Events } = require("discord.js");

module.exports.run = async (client) => {
  client.on(Events.ClientReady, () => {
    console.log(`Logged in as ${client.user.tag} !\n`);

    client.user.setActivity("My name is Kara");
  });
};
