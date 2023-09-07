const fs = require("fs");
const getPassPhrase = require("./getPassPhrase.js").getPassPhrase;
const updateUserRequest = require("./getPassPhrase.js").updateUser;

module.exports.updateUser = updateUser;
async function updateUser({ userName, userId, data }) {
  const userExist = fs.existsSync(__dirname + "/../data/clients/" + userId + ".json");
  //if (!userExist) return;
  const { err, clientToken, passPhrase } = await getPassPhrase({ userId, userName, avatarUrl: data.avatarUrl });
  if (err) return err;
  const dataRequest = passPhrase ? await updateUserRequest({ clientToken, passPhrase, data }) : { clientExist: false };
  if (dataRequest.errRequest) return data.errRequest;

  if (dataRequest !== true) {
    fs.unlinkSync(__dirname + "/../data/clients/" + userId + ".json");
    return updateUser({ userName, userId, data });
  }

  return true;
}
