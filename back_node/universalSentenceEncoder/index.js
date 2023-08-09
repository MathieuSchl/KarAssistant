const fs = require("fs");
const encodeSentence = require("./universalSentenceEncoder").encodeSentence;
const compareSentences = require("./universalSentenceEncoder").compareSentences;
const start = require("./universalSentenceEncoder").start;

const vectors = [];

let lineProgress = "";
function progressLog(text) {
  for (let index = 0; index < text.length; index++) {
    if (text[index] !== lineProgress[index]) {
      if (process.stdout.cursorTo) process.stdout.cursorTo(index);
      else process.stdout.write("\n");
      process.stdout.write(text[index]);
    }
  }

  for (let index = text.length; index < lineProgress.length; index++) {
    process.stdout.write(" ");
  }

  lineProgress = text;
}

function dateDiff(dateStart, dateEnd) {
  const timeDifference = dateEnd - dateStart;

  const seconds = Math.floor(timeDifference / 1000) % 60;
  const minutes = Math.floor(timeDifference / (1000 * 60)) % 60;
  const hours = Math.floor(timeDifference / (1000 * 60 * 60)) % 24;
  const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24)) % 30; // Assuming a month has 30 days for simplicity
  const months = Math.floor(timeDifference / (1000 * 60 * 60 * 24 * 30)) % 12;
  const years = Math.floor(timeDifference / (1000 * 60 * 60 * 24 * 365));

  let result = "";

  if (years > 0) {
    result += `${years} year${years > 1 ? "s" : ""} `; //Yes, you have to worry if the encoding lasts more than a year
  }

  if (months > 0) {
    result += `${months} month${months > 1 ? "s" : ""} `; //Yes, you have to worry if the encoding lasts more than a month
  }

  if (days > 0) {
    result += `${days} day${days > 1 ? "s" : ""} `; //Yes, you have to worry if the encoding lasts more than a day
  }

  if (hours > 0) {
    result += `${hours} hour${hours > 1 ? "s" : ""} `; //Yes, you have to worry if the encoding lasts more than a hour
  }

  if (minutes > 0) {
    result += `${minutes} minute${minutes > 1 ? "s" : ""} `;
  }

  if (seconds > 0) {
    result += `${seconds} second${seconds > 1 ? "s" : ""} `;
  }

  return result.trim();
}

module.exports.start = async () => {
  await start();
  const dateStart = new Date();

  const limitSkills = !process.argv[2]
    ? false
    : fs.existsSync(__dirname + "/../skills/" + process.argv[2] + "/index.js");
  if (!limitSkills && process.argv[2])
    console.log(`\x1b[31mThe skill '${process.argv[2]}' doesn't exist.\nSkipping limit, loading all skills\x1b[0m`);
  const files = limitSkills ? process.argv[2] : fs.readdirSync(__dirname + "/../skills", { withFileTypes: true });
  const folders = limitSkills ? [process.argv[2]] : files.filter((file) => file.isDirectory()).map((file) => file.name);

  console.log(`\n\x1b[34m├─ skills`);
  for (let index = 0; index < folders.length; index++) {
    const folder = folders[index];

    console.log(`${index !== folders.length - 1 ? "├" : "└"}─── ${folder}`);
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

  if (process.stdout.cursorTo) {
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
  } else process.stdout.write("\n");
  process.stdout.write(`\x1b[32m${length}/${length} 100.00%`);
  const dateEnd = new Date();
  const elapsedTimeText = dateDiff(dateStart, dateEnd);
  console.log(`\n\x1b[33mEncode sentences finished in \x1b[35m${elapsedTimeText}\x1b[0m\n`);
};

module.exports.query = async ({ query }) => {
  const embedding = await encodeSentence(query);
  let result = { similarity: 1, bestPhrase: "" };
  for (const vector of vectors) {
    const similarity = await compareSentences(vector.embedding, embedding);

    if (similarity < result.similarity) {
      result.similarity = similarity;
      result.lang = vector.lang;
      result.bestPhrase = vector.phrase;
      result.skill = vector.skill;
      if (result.similarity < 0.1) {
        result.result = await require(__dirname + "/../skills/" + result.skill).execute({ lang: result.lang });
        return result;
      }
    }
  }

  if (result.similarity < 0.2) {
    result.result = await require(__dirname + "/../skills/" + result.skill).execute({ lang: result.lang });
  } else {
    if (result.similarity < 0.3) {
      saveQueryClose(result, query);
    }
    result.result = "Je n'ai pas compris ce vous voulez dire";
  }

  return result;
};

async function saveQueryClose(result, query) {
  const dataRead = fs.readFileSync(__dirname + "/../data/querriesClose.json", "utf8");
  const content = JSON.parse(dataRead);
  content.push({
    query,
    similarity: result.similarity,
    lang: result.lang,
    skill: result.skill,
    bestPhrase: result.bestPhrase,
  });
  const dataWrite = JSON.stringify(content);
  fs.writeFileSync(__dirname + "/../data/querriesClose.json", dataWrite, "utf8");
}
