const fs = require("fs");
const NodeRSA = require("node-rsa");
const ipFunctions = require("../../utils/antiSpam");
const logger = require("../../utils/logger").logger;
const verifyPassPhrase = require("../../utils/verifyPassPhrase").verifyPassPhrase;

/**
 * @swagger
 * /api/user:
 *   put:
 *     summary: Update a client
 *     tags: [User]
 *     parameters:
 *     - name: "clientToken"
 *       in: "query"
 *       description: "Client token"
 *       type: string
 *     - name: "passPhrase"
 *       in: "query"
 *       description: "Pass phrase to verify client"
 *       type: string
 *     requestBody:
 *       description: "Data for the user"
 *       required: true
 *       content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              timeZone:
 *                type: string
 *              newPassword:
 *                type: string
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
 *       403:
 *         description: "User is not authenticated"
 *       500:
 *         description: "Error in back"
 */

module.exports.start = (app) => {
  app.put("/api/user", async function (req, res) {
    try {
      const ipAddress = ipFunctions.getIpAddress(req.socket.remoteAddress);
      const ipValid = ipFunctions.antiSpam({ ipAddress, limit: 5 });
      logger({ route: "PUT /api/user", ipAddress, ipValid });
      if (!ipValid) return res.sendStatus(403);

      const clientToken = req.query.clientToken;
      let clientExist = clientToken && fs.existsSync(__dirname + "/../../data/users/clients/" + clientToken + ".json");
      if (!clientExist) return res.sendStatus(403);
      const clientDataRead = fs.readFileSync(__dirname + "/../../data/users/clients/" + clientToken + ".json", "utf8");
      const clientContent = JSON.parse(clientDataRead);
      clientContent.lastRequestDate = new Date();
      fs.writeFileSync(__dirname + "/../../data/users/clients/" + clientToken + ".json", JSON.stringify(clientContent));

      userToken = clientContent.userToken;
      const privateKey = new NodeRSA(clientContent.privateKey);

      try {
        const passPhrase = req.query.passPhrase;
        const decryptedPassPhrase = privateKey.decrypt(passPhrase, "utf8");

        clientExist = verifyPassPhrase({
          passPhrase: decryptedPassPhrase,
          clientToken,
        });
        if (!clientExist && !process.env.DEV_MODE) throw 403;
      } catch (e) {
        console.log(e);
        throw 403;
      }

      const userDataRead = fs.readFileSync(__dirname + "/../../data/users/users/" + userToken + ".json", "utf8");
      userContent = JSON.parse(userDataRead);

      //Add data to user
      const discordAvatarUrl = req.body?.discordAvatarUrl;
      if (discordAvatarUrl) userContent.data.discordAvatarUrl = discordAvatarUrl;
      const timeZone = req.body?.timeZone;
      if (timeZone) userContent.data.timeZone = timeZone;

      fs.writeFileSync(__dirname + "/../../data/users/users/" + userToken + ".json", JSON.stringify(userContent));

      return res.sendStatus(200);
    } catch (e) {
      if (typeof e === "number") return res.sendStatus(e);
      if (e) console.log(e);
      console.log();
      return res.sendStatus(500);
    }
  });
};
