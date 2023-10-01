const { Events } = require("discord.js");
const listCommands = require("../utils/loadCommands").listCommands;

module.exports.run = async (client) => {
  client.on(Events.InteractionCreate, (interaction) => {
    if (interaction.isChatInputCommand()) {
      try {
        listCommands[interaction.commandName](interaction);
      } catch (error) {
        interaction.reply("There is an error with the command");
      }
    }
  });
};
