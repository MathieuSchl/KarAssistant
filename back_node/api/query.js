const use = require("../universalSentenceEncoder/index");

/**
 * @swagger
 * /api/query/:
 *   get:
 *     summary: Ask something to Kara
 *     tags: []
 *     parameters:
 *     - name: "query"
 *       in: "query"
 *       description: "The question"
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
 *                 result:
 *                   type: "string"
 *                   description: Phrase from Kara (always present)
 *                 similarity:
 *                   type: number
 *                   description: Value of similarity between the answer and the query or bestPhrase (if the question is invalid)
 *                 bestPhrase:
 *                   type: "string"
 *                   description: The sentence that comes closest (invalid question)
 *               example:
 *                 result: Bonjour je suis Kara
 */

module.exports.start = (app) => {
  app.get("/api/query", async function (req, res) {
    const result = await use.query({ query: req.query.query.toLowerCase() });
    res.json(result);
  });
};
