const { Events } = require("discord.js");
const heyKara = require("../utils/heyKara").heyKara;

module.exports.run = async (client) => {
  client.on(Events.MessageCreate, async (message) => {
    if (message.author.id === client.user.id) return; //Dont send message if the author is the bot

    const userName = message.author.username;
    const userId = message.author.id;
    const messageContent = message.content;
    const avatar = message.author.avatar;
    const avatarUrl = avatar ? `https://cdn.discordapp.com/avatars/${userId}/${avatar}.webp` : null;

    // Mesage is DM
    if (message.guild === null) {
      const resultPhrase = await heyKara({ userName, userId, messageContent, avatarUrl });
      return message.author.send(resultPhrase);
    }
  });
};
