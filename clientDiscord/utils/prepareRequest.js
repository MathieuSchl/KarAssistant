const fs = require("fs");
const encryptData = require("./RSA").encryptData;
const updateUser = require("./updateUser").updateUser;
const { stringify } = require("qs");
const axios = require("axios");
const api = axios.create({
  paramsSerializer: {
    serialize: stringify, // or (params) => Qs.stringify(params, {arrayFormat: 'brackets'})
  },
});
const NodeRSA = require("node-rsa");
require("dotenv").config();
/* c8 ignore start */
async function createNewClient({ authautifierTag }) {
  return await new Promise(function (resolve, reject) {
    if (process.env.IS_TEST)
      return resolve({
        clientToken: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
        publicKey: "PUBLIC KEY",
      });
    api({
      method: "GET",
      headers: { "Content-Type": "application/json" },
      params: { appType: "discord", authautifierTag },
      url: process.env.BACK_URL + "/api/client/newToken",
    })
      .then(function (response) {
        if (response.status !== 200) throw "Create new client status : " + response.status;
        resolve(response.data);
      })
      .catch(function (error) {
        if (error.code === "ECONNREFUSED")
          return resolve({ err: "Access to the Kara server cannot be established", status: 420 });
        else if (error.response && error.response.status === 403)
          return resolve({ err: "Access to the Kara server is forbidden", status: error.response.status });
        else if (error.response && error.response.status === 500)
          return resolve({ err: "Kara as an internal error", status: error.response.status });
        else {
          console.log(error);
          return resolve({ err: error.code, status: error.response ? error.response.status : 420 });
        }
      });
  });
}

module.exports.decryptResult = decryptResult;
async function decryptResult({ data, publicKey }) {
  try {
    const keyPublic = new NodeRSA(publicKey);
    const resultDecrypted = keyPublic.decryptPublic(data, "utf8");
    return JSON.parse(resultDecrypted);
  } catch {
    return null;
  }
}

/* c8 ignore stop */

module.exports.prepareRequest = async ({ userId, userName, avatarUrl, messageContent }) => {
  const userExist = fs.existsSync(__dirname + "/../data/clients/" + userId + ".json");
  const { err, clientToken, publicKey } = await new Promise(async (resolve, reject) => {
    if (userExist) {
      const userData = JSON.parse(fs.readFileSync(__dirname + "/../data/clients/" + userId + ".json", "utf8"));
      resolve({ clientToken: userData.clientToken, publicKey: userData.publicKey });
    } else {
      const newClient = await createNewClient({ authautifierTag: userId });
      if (newClient.err) return resolve({ err: newClient.err });
      const userData = {
        userName,
        avatarUrl,
        clientToken: newClient.clientToken,
        publicKey: newClient.publicKey,
      };
      fs.writeFileSync(__dirname + "/../data/clients/" + userId + ".json", JSON.stringify(userData));
      const res = await updateUser({
        userName,
        userId,
        data: { discordAvatarUrl: avatarUrl },
      });
      resolve(newClient);
    }
  });
  if (err) return { err };

  const data = await encryptData({
    data: { query: messageContent },
    publicKey,
  });

  return { clientToken, data, publicKey };
};
