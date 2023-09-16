const use = require("../universalSentenceEncoder/index");
const ipFunctions = require("../utils/antiSpam");
const logger = require("../utils/logger").logger;

/**
 * @swagger
 * tags:
 *   name: Kara
 *   description: My name is car
 */

/**
 * @swagger
 * /api/heyKara/:
 *   get:
 *     summary: Ask something to Kara
 *     tags: [Kara]
 *     parameters:
 *     - name: karaeatcookies
 *       in: "header"
 *       description: Cookie of the user making the request
 *       required: true
 *       type: string
 *     - name: "data"
 *       in: "query"
 *       description: "The question encrypted"
 *       required: true
 *       type: string
 *     responses:
 *       200:
 *         description: "Get all ticlets data from a user"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 similarity:
 *                   type: number
 *                   description: Value of similarity between the answer and the query or bestPhrase
 *                 bestPhrase:
 *                   type: string
 *                   description: The sentence that comes closest
 *                 shortAnswerExpected:
 *                   type: boolean
 *                   description: If the next answer from the client must be short
 *                 clientExist:
 *                   type: boolean
 *                   description: Show if the user is valid with RSA keys
 *                 lang:
 *                   type: string
 *                   description: Language of the question
 *                 skill:
 *                   type: string
 *                   description: Skill aked for the question
 *                 result:
 *                   type: string
 *                   description: Phrase from Kara
 *                 convToken:
 *                   type: string
 *                   description: Token given to aswer a question from Kara
 *               example:
 *                 similarity: 0.212
 *                 bestPhrase: Bonjour
 *                 shortAnswerExpected: false
 *                 clientExist: false
 *                 lang: fr
 *                 skill: kara/greetings
 *                 result: Bonjour je suis Kara
 *                 convToken: aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
 *       403:
 *         description: "User is not authenticated"
 *       500:
 *         description: "Error in back"
 */

module.exports.start = (app) => {
  app.get("/api/heyKara", async function (req, res) {
    try {
      if (!req.headers.karaeatcookies || !req.query.data) return res.sendStatus(400);
      const ipAddress = ipFunctions.getIpAddress(req.socket.remoteAddress);
      logger({ route: "GET /api/heyKara", ipAddress, ipValid: true });
      const result = await use.query({
        clientToken: req.headers.karaeatcookies,
        data: req.query.data,
        ipAddress,
      });
      res.send(result);
    } catch (e) {
      if (typeof e === "number") return res.sendStatus(e);
      if (e) console.log(e);
      console.log();
      res.sendStatus(500);
    }
  });
};
