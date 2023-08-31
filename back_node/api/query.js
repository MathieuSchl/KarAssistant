const use = require("../universalSentenceEncoder/index");

/**
 * @swagger
 * /api/heyKara/:
 *   get:
 *     summary: Ask something to Kara
 *     tags: []
 *     parameters:
 *     - name: "query"
 *       in: "query"
 *       description: "The question"
 *       required: true
 *       type: string
 *     - name: "token"
 *       in: "query"
 *       description: "Token for response"
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
 *                 token:
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
 *                 lang: fr
 */

module.exports.start = (app) => {
  app.get("/api/heyKara", async function (req, res) {
    try {
      const result = await use.query({
        query: req.query.query.toLowerCase(),
        token: req.query.token,
        timeZone: req.query.timeZone,
      });
      res.json(result);
    } catch {
      res.sendStatus(500);
    }
  });
};
