const { REST, Routes } = require("discord.js");
const fs = require("fs");
require("dotenv").config();

const GUILD_ID = process.env.GUILD_ID;
const TOKEN = process.env.DISCORD_TOKEN;

const listCommands = {};
module.exports.listCommands = listCommands;

module.exports.run = async (client) => {
  // Create all commands
  const commands = [];
  const commandFolders = fs.readdirSync(__dirname + "/../interactions/commands/");

  for (const folder of commandFolders) {
    // Grab all the command files from the commands directory you created earlier
    const commandsPath = __dirname + "/../interactions/commands/" + folder;

    const command = require(commandsPath);
    if ("data" in command && "execute" in command) {
      const data = command.data;
      listCommands[data.name] = command.execute;
      commands.push(data);
    } else {
      console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
  }

  // Construct and prepare an instance of the REST module
  const rest = new REST().setToken(TOKEN);

  // and deploy your commands!
  try {
    client.application.commands.set(commands, GUILD_ID);
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error(error);
  }
};
