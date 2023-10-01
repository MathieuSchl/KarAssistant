const { ApplicationCommandOptionType } = require("discord.js");
const updateUser = require("../../utils/updateUser").updateUser;

const listOfTimezones = [
  "Pacific/Kiritimati",
  "Pacific/Tongatapu",
  "Pacific/Apia",
  "Asia/Anadyr",
  "Asia/Kamchatka",
  "Asia/Tokyo",
  "Asia/Hong_Kong",
  "Asia/Kolkata",
  "Asia/Dubai",
  "Europe/Moscow",
  "Europe/Paris",
  "Europe/London",
  "Africa/Cairo",
  "Africa/Nairobi",
  "Asia/Kuwait",
  "Europe/Athens",
  "Asia/Baghdad",
  "Europe/Istanbul",
  "Asia/Tehran",
  "Asia/Kabul",
  "Asia/Baku",
  "Asia/Ashgabat",
  "Asia/Muscat",
  "Asia/Tashkent",
  "Asia/Almaty",
];

const choices = [];
for (const timezone of listOfTimezones) {
  choices.push({ name: timezone, value: timezone });
}

module.exports = {
  data: {
    name: "settimezone",
    description: "Set the time zone, to get the time right",
    options: [
      {
        type: ApplicationCommandOptionType.String,
        name: "timezone",
        description: "Value for the new time zone",
        required: true,
        choices,
      },
    ],
  },
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    const timeZone = interaction.options.get("timezone").value;
    const userName = interaction.user.userName;
    const userId = interaction.user.id;

    const result = await updateUser({ userName: userName, userId: userId, data: { timeZone } });
    return interaction.followUp(
      result ? "Time zone has been updated" : "ERROR: Could not update time zone. Try again later."
    );
  },
};
