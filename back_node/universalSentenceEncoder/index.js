const fs = require("fs");
const NodeRSA = require("node-rsa");
const encodeSentence = require("./universalSentenceEncoder").encodeSentence;
const createVector = require("./universalSentenceEncoder").createVector;
const compareSentences = require("./universalSentenceEncoder").compareSentences;
const start = require("./universalSentenceEncoder").start;
const verifyPassPhrase = require("../utils/verifyPassPhrase").verifyPassPhrase;

const vectors = [];

let lineProgress = "";
function progressLog(text) {
  if (process.stdout.cursorTo) {
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
  } else {
    console.log(text);
  }
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

  if (result == "") {
    result += `${timeDifference} millisecond${timeDifference > 1 ? "s" : ""} `;
  }

  return result.trim();
}

function loadSkill({ skill }) {
  console.log("-- " + skill);
  const file = require(__dirname + "/../skills/" + skill);
  const phrases = file.data.phrases;
  const langs = Object.keys(phrases);
  for (const lang of langs) {
    for (const phrase of phrases[lang]) {
      vectors.push({ skill: skill, lang, phrase });
    }
  }
}

function getAllSkills(path) {
  let result = [];
  if (fs.lstatSync(__dirname + "/../skills/" + path).isDirectory()) {
    const elementExist = fs.existsSync(__dirname + "/../skills/" + path + "/index.js");
    const elementIsFile = elementExist ? fs.lstatSync(__dirname + "/../skills/" + path + "/index.js").isFile() : false;

    if (elementExist && elementIsFile) {
      result.push(path);
    } else {
      const elements = fs.readdirSync(__dirname + "/../skills/" + path);
      for (const element of elements) {
        const resultFolder = getAllSkills(`${path}${path != "" ? "/" : ""}${element}`);
        result = result.concat(resultFolder);
      }
    }
  }
  return result;
}

module.exports.start = async () => {
  await start();
  const dateStart = new Date();

  console.log(`\n\x1b[34mskills`);
  const limitSkills = !process.argv[2]
    ? false
    : fs.existsSync(__dirname + "/../skills/" + process.argv[2] + "/index.js");
  if (!limitSkills && process.argv[2])
    console.log(`\x1b[31mThe skill '${process.argv[2]}' doesn't exist.\nSkipping limit, loading all skills\x1b[0m`);
  if (limitSkills) {
    loadSkill({ skill: process.argv[2] });
  } else {
    const folders = getAllSkills("");

    for (let index = 0; index < folders.length; index++) {
      const folder = folders[index];

      loadSkill({ skill: folder });
    }
  }

  const vectorToFile = {};
  const vectorSaved = JSON.parse(fs.readFileSync(__dirname + "/../data/vectors.json", "utf8"));
  console.log("\n\x1b[33mStart encode sentences\x1b[34m");
  const length = vectors.length;
  progressLog(`0/${length} 00.00%`);
  for (let index = 0; index < vectors.length; index++) {
    const values =
      vectorSaved[vectors[index].phrase] != null
        ? vectorSaved[vectors[index].phrase]
        : vectorToFile[vectors[index].phrase]
        ? vectorToFile[vectors[index].phrase]
        : await encodeSentence(vectors[index].phrase);
    const vector = createVector(values);
    vectors[index].embedding = vector;
    vectorToFile[vectors[index].phrase] = values;
    progressLog(`${index + 1}/${length} ${(((index + 1) / length) * 100).toFixed(2)}%`);
  }

  if (process.stdout.cursorTo) {
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
  } else process.stdout.write("\n");

  fs.writeFileSync(__dirname + "/../data/vectors.json", JSON.stringify(vectorToFile));

  process.stdout.write(`\x1b[32m${length}/${length} 100.00%`);
  const dateEnd = new Date();
  const elapsedTimeText = dateDiff(dateStart, dateEnd);
  console.log(`\n\x1b[33mEncode sentences finished in \x1b[35m${elapsedTimeText}\x1b[0m\n`);
};

module.exports.query = async ({ query, clientToken = false, passPhrase, convToken = false, timeZone }) => {
  const embedding = await encodeSentence(query);
  let clientExist = clientToken && fs.existsSync(__dirname + "/../data/users/clients/" + clientToken + ".json");
  const convExist = convToken && fs.existsSync(__dirname + "/../data/sessions/" + convToken + ".json");
  const result = { similarity: 1, bestPhrase: "", shortAnswerExpected: false };
  const resData = {};
  let userToken = null;
  let userContent = null;

  //Used saved users
  if (clientExist) {
    const clientDataRead = fs.readFileSync(__dirname + "/../data/users/clients/" + clientToken + ".json", "utf8");
    const clientContent = JSON.parse(clientDataRead);
    clientContent.lastRequestDate = new Date();
    fs.writeFileSync(__dirname + "/../data/users/clients/" + clientToken + ".json", JSON.stringify(clientContent));

    userToken = clientContent.userToken;
    const privateKey = new NodeRSA(clientContent.privateKey);

    try {
      const decryptedPassPhrase = privateKey.decrypt(passPhrase, "utf8");

      clientExist = verifyPassPhrase({
        passPhrase: decryptedPassPhrase,
        clientToken,
      });
      if (!clientExist && !process.env.DEV_MODE) throw 403;
    } catch {
      throw 403;
    }

    const userDataRead = fs.readFileSync(__dirname + "/../data/users/users/" + userToken + ".json", "utf8");
    userContent = JSON.parse(userDataRead);

    if (!timeZone && userContent.timeZone) timeZone = userContent.timeZone;

    userContent.creationDate = new Date(userContent.creationDate);
    userContent.lastRequestDate = new Date();
  } else if (!process.env.DEV_MODE) throw 403;
  result.clientExist = clientExist; // RSA good ? Remove this

  //Used saved sessions
  if (convExist) {
    const dataRead = fs.readFileSync(__dirname + "/../data/sessions/" + convToken + ".json", "utf8");
    const content = JSON.parse(dataRead);

    try {
      const skillResult = await require(__dirname + "/../skills/" + content.skill + "/session").execute({
        query,
        userData: userContent ? userContent.data : null,
        timeZone,
        lang: content.lang,
        data: content.data,
      });
      if (skillResult != null) {
        result.result = skillResult.text;
        result.shortAnswerExpected = !!skillResult.shortAnswerExpected;
        resData.data = skillResult.data;
        resData.lang = skillResult.lang ? skillResult.lang : content.lang;
        resData.skill = content.skill;
        if (skillResult.userData) userContent.data = skillResult.userData;
      }
    } catch (error) {
      console.log("\x1b[31mERROR: skill " + result.skill + "\x1b[0m");
      console.log(error);
      throw null;
    }
  }

  if (result.result == null) {
    //Loop on all skills
    for (const vector of vectors) {
      if (result.result) break;
      const similarity = await compareSentences(vector.embedding, embedding);

      if (similarity < result.similarity) {
        result.similarity = similarity;
        result.lang = vector.lang;
        result.bestPhrase = vector.phrase;
        result.skill = vector.skill;
        //Execute skill if very close
        if (result.similarity < 0.1) {
          try {
            const skillResult = await require(__dirname + "/../skills/" + result.skill).execute({
              query,
              lang: result.lang,
              userData: userContent ? userContent.data : null,
              timeZone,
            });
            result.result = skillResult.text;
            result.shortAnswerExpected = !!skillResult.shortAnswerExpected;
            resData.data = skillResult.data;
            if (skillResult.userData) userContent.data = skillResult.userData;
            break;
          } catch (error) {
            console.log("\x1b[31mERROR: skill " + result.skill + "\x1b[0m");
            console.log(error);
            throw null;
          }
        }
      }
    }
  }

  //Exeption of the closest competence
  if (!result.result && result.similarity < 0.2) {
    try {
      const skillResult = await require(__dirname + "/../skills/" + result.skill).execute({
        query,
        lang: result.lang,
        userData: userContent ? userContent.data : null,
        timeZone,
      });
      result.result = skillResult.text;
      result.shortAnswerExpected = !!skillResult.shortAnswerExpected;
      resData.data = skillResult.data;
      if (skillResult.userData) userContent.data = skillResult.userData;
    } catch (error) {
      console.log("\x1b[31mERROR: skill " + result.skill + "\x1b[0m");
      console.log(error);
      throw null;
    }
  }
  if (!result.result) {
    //Save if it's close, but not too close
    //This is used for logs
    if (result.similarity < 0.3) {
      saveQueryClose(result, query);
    }
    result.result = "Je n'ai pas compris ce que vous voulez dire";
  } else if (convExist) {
    fs.unlinkSync(__dirname + "/../data/sessions/" + convToken + ".json");
  }

  //Save data if Kara ask something to user
  if (resData.data) {
    if (!resData.lang) resData.lang = result.lang;
    if (!resData.skill) resData.skill = result.skill;
    resData.creationDate = new Date();
    const convToken = require("../utils/makeToken").generateToken({
      type: "data/sessions",
    });
    result.convToken = convToken;
    fs.writeFileSync(__dirname + "/../data/sessions/" + convToken + ".json", JSON.stringify(resData));
  }

  if (userToken) {
    fs.writeFileSync(__dirname + "/../data/users/users/" + userToken + ".json", JSON.stringify(userContent));
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
