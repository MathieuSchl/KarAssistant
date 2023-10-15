const NodeRSA = require("node-rsa");

module.exports.encryptData = encryptData;
async function encryptData({ data, key }) {
  try {
    const keyPublic = new NodeRSA(key);
    const passPhraseEncrypted = keyPublic.encrypt(JSON.stringify(data), "base64");
    return passPhraseEncrypted;
  } catch {
    return null;
  }
}
