const { Events } = require("discord.js");
const updateUser = require("../utils/updateUser").updateUser;

module.exports.run = async (client) => {
  client.on(Events.ClientReady, () => {
    console.log(`Logged in as ${client.user.tag} !\n`);

    client.user.setActivity("My name is Kara");

    //updateUser({ userName: "test", userId: "2224", data: { discordAvatarUrl: "http://aaaaaaaaaaaaaaa.com" } });
  });
};
