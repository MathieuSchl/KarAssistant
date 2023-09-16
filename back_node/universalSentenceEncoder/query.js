const fs = require("fs");
const encodeSentence = require("./universalSentenceEncoder").encodeSentence;
const compareSentences = require("./universalSentenceEncoder").compareSentences;
const loadPrivateKey = require("../utils/RSA").loadPrivateKey;
const encryptPrivate = require("../utils/RSA").encryptPrivate;
const decryptPrivate = require("../utils/RSA").decryptPrivate;
const timeIntervalAllowed = 5 * 1000;

const vectors = require("./loadSkills").vectors;

module.exports.query = async ({ clientToken, data, ipAddress }) => {
  if (!fs.existsSync(__dirname + "/../data/users/clients/" + clientToken + ".json")) throw 403;
  const initialClientData = fs.readFileSync(__dirname + "/../data/users/clients/" + clientToken + ".json", "utf8");
  const clientContent = JSON.parse(initialClientData);
  clientContent.lastRequestDate = new Date();

  const userToken = clientContent.userToken;
  const privateKey = loadPrivateKey({ privateKey: clientContent.privateKey });

  const { decryptError, decryptedData } = await decryptPrivate({ privateKey, data });
  if (decryptError) throw decryptError;

  if (!decryptedData.query || !decryptedData.date) throw 400;
  const query = decryptedData.query;
  const date = new Date(decryptedData.date);
  const nowDate = new Date();

  // Add date validation
  if (date > nowDate) return false; // Date from the PassPhrase cant be in the future
  if (nowDate - date > timeIntervalAllowed) throw 403; // Request expired

  // Load user data
  const initialUserData = fs.readFileSync(__dirname + "/../data/users/users/" + userToken + ".json", "utf8");
  const userContent = JSON.parse(initialUserData);

  const embedding = await encodeSentence(query);
  const result = { similarity: 1, bestPhrase: "", shortAnswerExpected: false };
  const resData = {};

  if (clientContent.session && clientContent.session.skill) {
    try {
      const skillResult = await require(__dirname + "/../skills/" + clientContent.session.skill + "/session").execute({
        query,
        userData: userContent ? userContent.data : null,
        lang: clientContent.session.lang,
        data: clientContent.session.data,
      });
      if (skillResult != null) {
        result.result = skillResult.text;
        result.shortAnswerExpected = !!skillResult.shortAnswerExpected;
        resData.data = skillResult.data;
        if (skillResult.userData) userContent.data = skillResult.userData;
        if (skillResult.session) {
          if (!clientContent.session) clientContent.session = {};
          clientContent.session.skill = skillResult.skill ? skillResult.skill : clientContent.session.skill;
          clientContent.session.lang = skillResult.lang ? skillResult.lang : clientContent.session.lang;
          clientContent.session.data = skillResult.session;
        } else {
          delete clientContent.session;
        }
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
            });
            result.result = skillResult.text;
            result.shortAnswerExpected = !!skillResult.shortAnswerExpected;
            resData.data = skillResult.data;
            if (skillResult.userData) userContent.data = skillResult.userData;
            if (skillResult.session) {
              if (!clientContent.session) clientContent.session = {};
              clientContent.session.skill = result.skill;
              clientContent.session.lang = result.lang;
              clientContent.session.data = skillResult.session;
            }
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
      });
      result.result = skillResult.text;
      result.shortAnswerExpected = !!skillResult.shortAnswerExpected;
      resData.data = skillResult.data;
      if (skillResult.userData) userContent.data = skillResult.userData;
      if (skillResult.session) {
        if (!clientContent.session) clientContent.session = {};
        clientContent.session.skill = result.skill;
        clientContent.session.lang = result.lang;
        clientContent.session.data = skillResult.session;
      }
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
  }

  // Save client data
  const newClientContent = JSON.stringify(clientContent);
  if (initialClientData !== newClientContent)
    fs.writeFileSync(__dirname + "/../data/users/clients/" + clientToken + ".json", newClientContent);

  // Save user data
  const newUserData = JSON.stringify(userContent);
  if (initialUserData !== newUserData)
    fs.writeFileSync(__dirname + "/../data/users/users/" + userToken + ".json", newUserData);

  const { encryptError, encryptedData } = await encryptPrivate({ privateKey, data: result });
  if (encryptError) throw encryptError;

  return encryptedData;
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
