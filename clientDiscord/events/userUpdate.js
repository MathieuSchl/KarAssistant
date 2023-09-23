const { Events } = require("discord.js");
const updateUser = require("../utils/updateUser").updateUser;

module.exports.run = async (client) => {
  client.on(Events.UserUpdate, (oldUser, newUser) => {
    const userName = newUser.username;
    const userId = newUser.id;
    const oldAvatar = oldUser.avatar;
    const newAvatar = newUser.avatar;
    if (oldAvatar !== newAvatar) {
      const avatarUrl = newAvatar ? `https://cdn.discordapp.com/avatars/${userId}/${newAvatar}.webp` : null;
      updateUser({ userName: userName, userId: userId, data: { discordAvatarUrl: avatarUrl } });
    }
  });
};
