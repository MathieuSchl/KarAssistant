const fs = require("fs");
const NodeRSA = require("node-rsa");
const ipFunctions = require("../../utils/antiSpam");
const logger = require("../../utils/logger").logger;

/**
 * @swagger
 * tags:
 *   name: User
 *   description: All about users
 */

/**
 * @swagger
 * /api/client/newToken:
 *   get:
 *     summary: Get new client token
 *     tags: [User]
 *     parameters:
 *     - name: "appType"
 *       in: "query"
 *       description: "The type of the client (mobile app, discord)"
 *       required: true
 *       type: string
 *     - name: "authautifierTag"
 *       in: "query"
 *       description: "String to authentify"
 *       type: string
 *     responses:
 *       200:
 *         description: "Token for new client"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 clientToken:
 *                   type: string
 *                   description: Token for the client
 *                 rsaPublicKey:
 *                   type: string
 *                   description: Key to encrypt data
 *               example:
 *                 clientToken: aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
 *                 rsaPublicKey: example
 */

module.exports.antiSpam = antiSpam;
function antiSpam(ipAddress) {
  if (!dataIp[ipAddress]) {
    dataIp[ipAddress] = {
      lastRequest,
    };
  }
}

module.exports.newUserToken = newUserToken;
function newUserToken() {
  const creationDate = new Date();
  const data = {
    creationDate,
    lastRequestDate: creationDate,
    clients: [],
    data: {},
  };
  const userToken = require("../../utils/makeToken").generateToken({
    type: "data/users/users",
  });

  return { userToken, data };
}

module.exports.newClientToken = newClientToken;
function newClientToken({ userFile, appType, authautifierTag }) {
  const clientToken = require("../../utils/makeToken").generateToken({
    type: "data/users/clients",
  });
  userFile.data.clients.push(clientToken);

  const keys = new NodeRSA({ b: 1024 });
  const publicKey = keys.exportKey("public");
  const privateKey = keys.exportKey("private");

  const creationDate = new Date();
  const data = {
    creationDate,
    lastRequestDate: creationDate,
    userToken: userFile.userToken,
    appType,
    authautifierTag,
    privateKey: privateKey,
  };

  return { userFile, clientFile: { clientToken, data }, publicKey: publicKey };
}

module.exports.saveData = saveData;
function saveData({ userFile, clientFile }) {
  fs.writeFileSync(
    __dirname + "/../../data/users/users/" + userFile.userToken + ".json",
    JSON.stringify(userFile.data)
  );

  fs.writeFileSync(
    __dirname + "/../../data/users/clients/" + clientFile.clientToken + ".json",
    JSON.stringify(clientFile.data)
  );
  return true;
}

module.exports.start = (app) => {
  app.get("/api/client/newToken", async function (req, res) {
    try {
      if (!req.query.appType) return res.sendStatus(400);
      const ipAddress = ipFunctions.getIpAddress(req.socket.remoteAddress);
      const ipValid = ipFunctions.antiSpam({ ipAddress, limit: 2 });
      logger({ route: "/api/client/newToken", ipAddress, ipValid });
      if (!ipValid) return res.sendStatus(403);
      const defaultUserFile = newUserToken();
      const { userFile, clientFile, publicKey } = newClientToken({
        userFile: defaultUserFile,
        appType: req.query.appType,
        authautifierTag: req.queryauthautifierTag,
      });
      saveData({ userFile, clientFile });

      return res.json({ clientToken: clientFile.clientToken, publicKey });
    } catch (e) {
      if (e) console.log(e);
      console.log();
      res.sendStatus(500);
    }
  });
};
