const NodeRSA = require("node-rsa");

module.exports.encryptData = encryptData;
async function encryptData({ data, publicKey }) {
  try {
    const keyPublic = new NodeRSA(publicKey);
    data.date = new Date().toUTCString();
    const passPhraseEncrypted = keyPublic.encrypt(JSON.stringify(data), "base64");
    return passPhraseEncrypted;
  } catch {
    return null;
  }
}
