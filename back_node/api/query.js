const use = require("../universalSentenceEncoder/index");
const reIpAddress = new RegExp("(?:[0-9]{1,3}.){3}[0-9]{1,3}");

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
 *     - name: "query"
 *       in: "query"
 *       description: "The question"
 *       required: true
 *       type: string
 *     - name: "userToken"
 *       in: "query"
 *       description: "User token"
 *       type: string
 *     - name: "convToken"
 *       in: "query"
 *       description: "Conversation token for response"
 *       type: string
 *     - name: "timeZone"
 *       in: "query"
 *       description: "TimeZone from the user"
 *       type: string
 *     responses:
 *       200:
 *         description: "Get all ticlets data from a user"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: string
 *                   description: Phrase from Kara
 *                 convToken:
 *                   type: string
 *                   description: Token given to aswer a question from Kara
 *                 lang:
 *                   type: string
 *                   description: Language of the question
 *                 skill:
 *                   type: string
 *                   description: Skill aked for the question
 *                 similarity:
 *                   type: number
 *                   description: Value of similarity between the answer and the query or bestPhrase
 *                 bestPhrase:
 *                   type: string
 *                   description: The sentence that comes closest
 *               example:
 *                 result: Bonjour je suis Kara
 *                 convToken: 899b048af6c033e29682c4cdf30c0050d3590959
 *                 lang: fr
 *                 skill: kara/greetings
 *                 similarity: 0.212
 *                 bestPhrase: Bonjour
 *       500:
 *         description: "Error in back"
 */

module.exports.start = (app) => {
  app.get("/api/heyKara", async function (req, res) {
    try {
      const result = await use.query({
        query: req.query.query.toLowerCase(),
        userToken: req.query.userToken,
        convToken: req.query.convToken,
        timeZone: req.query.timeZone,
        ipAddress: req.socket.remoteAddress.match(reIpAddress)[0],
      });
      res.json(result);
    } catch (e) {
      if (e) console.log(e);
      console.log();
      res.sendStatus(500);
    }
  });
};
