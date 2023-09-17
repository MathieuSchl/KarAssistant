const { Events } = require("discord.js");
const updateUser = require("../utils/updateUser").updateUser;

module.exports.run = async (client) => {
  client.on(Events.ClientReady, async () => {
    console.log(`Logged in as ${client.user.tag} !\n`);

    client.user.setActivity("My name is Kara");

    const res = await updateUser({
      userName: "test",
      userId: "210392675478667269",
      data: { discordAvatarUrl: "http://aaaaaaaaaaaaaaa.com" },
    });
  });
};
