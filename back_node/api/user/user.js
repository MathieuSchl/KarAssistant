const fs = require("fs");

/**
 * @swagger
 * tags:
 *   name: User
 *   description: Everything about users
 */

/**
 * @swagger
 * /api/user/newToken:
 *   get:
 *     summary: Get new user token
 *     tags: [User]
 *     responses:
 *       200:
 *         description: "Token from new user"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userToken:
 *                   type: string
 *                   description: Token for the user
 *               example:
 *                 userToken: 899b048af6c033e29682c4cdf30c0050d3590959
 */

module.exports.newUserToken = newUserToken;
function newUserToken() {
  const data = { creationDate: new Date(), lastRequestDate: new Date() };
  const userToken = require("../../utils/makeToken").generateToken({
    type: "data/users/users",
  });

  fs.writeFileSync(
    __dirname + "/../../data/users/users/" + userToken + ".json",
    JSON.stringify(data),
  );

  return userToken;
}

module.exports.start = (app) => {
  app.get("/api/user/newToken", async function (req, res) {
    try {
      const result = newUserToken();
      res.json({ userToken: result });
    } catch (e) {
      if (e) console.log(e);
      console.log();
      res.sendStatus(500);
    }
  });
};
