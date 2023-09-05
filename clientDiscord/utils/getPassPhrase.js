const fs = require("fs");
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
        if (error.code === "ECONNREFUSED") resolve({ err: "Access to the Kara server cannot be established" });
        if (error.response && error.response.status === 403) resolve({ err: "Access to the Kara server is forbidden" });
        else {
          console.log(error);
          resolve({ err: error.code });
        }
      });
  });
}

async function encryptPassPhrase({ clientToken, publicKey }) {
  try {
    const keyPublic = new NodeRSA(publicKey);
    const passPhrase = clientToken + ";" + new Date().toISOString();
    const passPhraseEncrypted = keyPublic.encrypt(passPhrase, "base64");
    return passPhraseEncrypted;
  } catch {
    return null;
  }
}

/* c8 ignore stop */

module.exports.getPassPhrase = async ({ userId, userName, avatarUrl }) => {
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
      resolve(newClient);
    }
  });
  if (err) return { err };

  const passPhraseEncrypted = await encryptPassPhrase({ clientToken, publicKey });

  return { clientToken, passPhrase: passPhraseEncrypted };
};
