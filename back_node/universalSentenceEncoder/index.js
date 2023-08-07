const fs = require("fs");
const encodeSentence = require("./universalSentenceEncoder").encodeSentence;
const compareSentences = require("./universalSentenceEncoder").compareSentences;
const start = require("./universalSentenceEncoder").start;

const vectors = [];

let lineProgress = "";
function progressLog(text) {
  for (let index = 0; index < text.length; index++) {
    if (text[index] !== lineProgress[index]) {
      process.stdout.cursorTo(index);
      process.stdout.write(text[index]);
    }
  }

  for (let index = text.length; index < lineProgress.length; index++) {
    process.stdout.write(" ");
  }

  lineProgress = text;
}

module.exports.start = async () => {
  await start();
  const files = fs.readdirSync(__dirname + "/../skills", { withFileTypes: true });
  const folders = files.filter((file) => file.isDirectory()).map((file) => file.name);

  for (const folder of folders) {
    const file = require(__dirname + "/../skills/" + folder);
    const phrases = file.data.phrases;
    const langs = Object.keys(phrases);
    for (const lang of langs) {
      for (const phrase of phrases[lang]) {
        vectors.push({ skill: folder, lang, phrase });
      }
    }
  }

  console.log("\n\x1b[33mStart encode sentences\x1b[34m");
  const length = vectors.length;
  progressLog(`0/${length} 00.00%`);
  for (let index = 0; index < vectors.length; index++) {
    vectors[index].embedding = await encodeSentence(vectors[index].phrase);
    progressLog(`${index + 1}/${length} ${(((index + 1) / length) * 100).toFixed(2)}%`);
  }
  process.stdout.clearLine(0);
  process.stdout.cursorTo(0);
  process.stdout.write(`\x1b[32m${length}/${length} 100.00%`);
  console.log("\n\x1b[33mEncode sentences finished\x1b[0m\n");
};

module.exports.query = async ({ query }) => {
  const embedding = await encodeSentence(query);
  let result = { similarity: 1, bestPhrase: "" };
  for (const vector of vectors) {
    const similarity = await compareSentences(vector.embedding, embedding);
    if (similarity < 0.1) {
      const lang = vector.lang;
      return { result: await require(__dirname + "/../skills/" + vector.skill).execute({ lang }), similarity };
    } else if (similarity < result.similarity) {
      result.similarity = similarity;
      result.bestPhrase = vector.phrase;
    }
  }
  result.result = "Je n'ai pas compris ce vous voulez dire";
  return result;
};
