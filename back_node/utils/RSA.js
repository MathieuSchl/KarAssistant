const NodeRSA = require("node-rsa");

module.exports.loadKey = ({ key }) => {
  const privateKeyObject = new NodeRSA(key);
  return privateKeyObject;
};

module.exports.encrypt = async ({ key, data }) => {
  return await new Promise((resolve, reject) => {
    try {
      const encryptedData = key.encrypt(JSON.stringify(data), "base64");
      resolve({ encryptedData });
    } catch {
      resolve({ encryptError: 403 });
    }
  });
};

module.exports.decrypt = async ({ key, data }) => {
  return await new Promise((resolve, reject) => {
    try {
      const decryptedData = key.decrypt(data, "utf8");
      resolve({ decryptedData: JSON.parse(decryptedData) });
    } catch {
      resolve({ decryptError: 403 });
    }
  });
};
