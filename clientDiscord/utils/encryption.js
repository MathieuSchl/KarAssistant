const NodeRSA = require("node-rsa");
const forge = require("node-forge");

module.exports = {
  rsa: {
    loadKey: ({ key }) => {
      try {
        const privateKeyObject = new NodeRSA(key);
        return privateKeyObject;
      } catch {
        return null;
      }
    },
    encrypt: async ({ key, data }) => {
      return await new Promise((resolve, reject) => {
        try {
          const encryptedData = key.encrypt(JSON.stringify(data), "base64");
          resolve({ encryptedData });
          /* c8 ignore start */
        } catch {
          resolve({ encryptError: 403 });
        }
        /* c8 ignore stop */
      });
    },
    decrypt: async ({ key, data }) => {
      return await new Promise((resolve, reject) => {
        try {
          const decryptedData = key.decrypt(data, "utf8");
          resolve({ decryptedData: JSON.parse(decryptedData) });
          /* c8 ignore start */
        } catch (e) {
          console.log(e);
          resolve({ decryptError: 403 });
        }
        /* c8 ignore stop */
      });
    },
  },
  aes: {
    encrypt: ({ message, keyBase64, ivBase64 }) => {
      const keyDecoded = keyBase64 ? forge.util.decode64(keyBase64) : forge.random.getBytesSync(16);
      const ivDecoded = ivBase64 ? forge.util.decode64(ivBase64) : forge.random.getBytesSync(16);

      const keyBase64Export = forge.util.encode64(keyDecoded);
      const ivBase64Export = forge.util.encode64(ivDecoded);

      const cipher = forge.cipher.createCipher("AES-CBC", keyDecoded);
      cipher.start({ iv: ivDecoded });
      cipher.update(forge.util.createBuffer(message));
      cipher.finish();
      const messageHex = cipher.output.toHex();

      return { messageHex, keyBase64: keyBase64Export, ivBase64: ivBase64Export };
    },
    decrypt: ({ keyBase64, ivBase64, messageHex }) => {
      const messageBuff = Buffer.from(messageHex, "hex");
      const key = forge.util.decode64(keyBase64);
      const iv = forge.util.decode64(ivBase64);

      const decipher = forge.cipher.createDecipher("AES-CBC", key);
      decipher.start({ iv });
      decipher.update(forge.util.createBuffer(messageBuff));
      decipher.finish();

      return decipher.output.toString("utf8");
    },
  },
};
