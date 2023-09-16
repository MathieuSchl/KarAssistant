const NodeRSA = require("node-rsa");

module.exports.loadPrivateKey = ({ privateKey }) => {
  const privateKeyObject = new NodeRSA(privateKey);
  return privateKeyObject;
};

module.exports.encryptPrivate = async ({ privateKey, data }) => {
  return await new Promise((resolve, reject) => {
    try {
      const encryptedData = privateKey.encryptPrivate(JSON.stringify(data), "base64");
      resolve({ encryptedData });
    } catch {
      resolve({ encryptError: 403 });
    }
  });
};

module.exports.decryptPrivate = async ({ privateKey, data }) => {
  return await new Promise((resolve, reject) => {
    try {
      const decryptedData = privateKey.decrypt(data, "utf8");
      resolve({ decryptedData: JSON.parse(decryptedData) });
    } catch {
      resolve({ decryptError: 403 });
    }
  });
};
