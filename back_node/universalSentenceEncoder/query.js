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
  const clientDataRead = fs.readFileSync(__dirname + "/../data/users/clients/" + clientToken + ".json", "utf8");
  const clientContent = JSON.parse(clientDataRead);
  clientContent.lastRequestDate = new Date();
  fs.writeFileSync(__dirname + "/../data/users/clients/" + clientToken + ".json", JSON.stringify(clientContent));

  const userToken = clientContent.userToken;
  const privateKey = loadPrivateKey({ privateKey: clientContent.privateKey });

  const { decryptError, decryptedData } = await decryptPrivate({ privateKey, data });
  if (decryptError) throw decryptError;

  if (!decryptedData.query || !decryptedData.date) throw 400;
  const query = decryptedData.query;
  const date = new Date(decryptedData.date);
  const nowDate = new Date();

  //Add date validation
  if (date > nowDate) return false; // Date from the PassPhrase cant be in the future
  if (nowDate - date > timeIntervalAllowed) throw 403; // Request expired

  // Load user data
  const initialUserData = fs.readFileSync(__dirname + "/../data/users/users/" + userToken + ".json", "utf8");
  const userContent = JSON.parse(initialUserData);

  const embedding = await encodeSentence(query);
  const result = { similarity: 1, bestPhrase: "", shortAnswerExpected: false };
  const resData = {};

  if (userContent.session && userContent.session.skill) {
    try {
      const skillResult = await require(__dirname + "/../skills/" + userContent.session.skill + "/session").execute({
        query,
        userData: userContent ? userContent.data : null,
        lang: userContent.session.lang,
        data: userContent.session.data,
      });
      if (skillResult != null) {
        result.result = skillResult.text;
        result.shortAnswerExpected = !!skillResult.shortAnswerExpected;
        resData.data = skillResult.data;
        if (skillResult.userData) userContent.data = skillResult.userData;
        if (skillResult.session) {
          userContent.session.skill = skillResult.skill ? skillResult.skill : userContent.session.skill;
          userContent.session.lang = skillResult.lang ? skillResult.lang : userContent.session.lang;
          userContent.session.data = skillResult.session;
        } else {
          delete userContent.session;
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
              userContent.session = {};
              userContent.session.skill = result.skill;
              userContent.session.lang = result.lang;
              userContent.session.data = skillResult.session;
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
        userContent.session = {};
        userContent.session.skill = result.skill;
        userContent.session.lang = result.lang;
        userContent.session.data = skillResult.session;
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

  // Save user data
  console.log(userContent);
  const newUserData = JSON.stringify(userContent);
  if (initialUserData !== newUserData)
    fs.writeFileSync(__dirname + "/../data/users/users/" + userToken + ".json", newUserData);

  const { encryptError, encryptedData } = await encryptPrivate({ privateKey, data: result });
  if (encryptError) throw encryptError;

  return encryptedData;

  //   const embedding = await encodeSentence(query);
  //   let clientExist = clientToken && fs.existsSync(__dirname + "/../data/users/clients/" + clientToken + ".json");
  //   const convExist = convToken && fs.existsSync(__dirname + "/../data/sessions/" + convToken + ".json");
  //   const result = { similarity: 1, bestPhrase: "", shortAnswerExpected: false };
  //   const resData = {};
  //   let userToken = null;
  //   let userContent = null;

  //   //Used saved users
  //   if (clientExist) {
  //     const userDataRead = fs.readFileSync(__dirname + "/../data/users/users/" + userToken + ".json", "utf8");
  //     userContent = JSON.parse(userDataRead);

  //     if (!timeZone && userContent.timeZone) timeZone = userContent.timeZone;

  //     userContent.creationDate = new Date(userContent.creationDate);
  //     userContent.lastRequestDate = new Date();
  //   } else if (!process.env.DEV_MODE) throw 403;
  //   result.clientExist = clientExist; // RSA good ? Remove this

  //   //Used saved sessions
  //   if (convExist) {
  //     const dataRead = fs.readFileSync(__dirname + "/../data/sessions/" + convToken + ".json", "utf8");
  //     const content = JSON.parse(dataRead);

  //     try {
  //       const skillResult = await require(__dirname + "/../skills/" + content.skill + "/session").execute({
  //         query,
  //         userData: userContent ? userContent.data : null,
  //         timeZone,
  //         lang: content.lang,
  //         data: content.data,
  //       });
  //       if (skillResult != null) {
  //         result.result = skillResult.text;
  //         result.shortAnswerExpected = !!skillResult.shortAnswerExpected;
  //         resData.data = skillResult.data;
  //         resData.lang = skillResult.lang ? skillResult.lang : content.lang;
  //         resData.skill = content.skill;
  //         if (skillResult.userData) userContent.data = skillResult.userData;
  //       }
  //     } catch (error) {
  //       console.log("\x1b[31mERROR: skill " + result.skill + "\x1b[0m");
  //       console.log(error);
  //       throw null;
  //     }
  //   }

  //   if (result.result == null) {
  //     //Loop on all skills
  //     for (const vector of vectors) {
  //       if (result.result) break;
  //       const similarity = await compareSentences(vector.embedding, embedding);

  //       if (similarity < result.similarity) {
  //         result.similarity = similarity;
  //         result.lang = vector.lang;
  //         result.bestPhrase = vector.phrase;
  //         result.skill = vector.skill;
  //         //Execute skill if very close
  //         if (result.similarity < 0.1) {
  //           try {
  //             const skillResult = await require(__dirname + "/../skills/" + result.skill).execute({
  //               query,
  //               lang: result.lang,
  //               userData: userContent ? userContent.data : null,
  //               timeZone,
  //             });
  //             result.result = skillResult.text;
  //             result.shortAnswerExpected = !!skillResult.shortAnswerExpected;
  //             resData.data = skillResult.data;
  //             if (skillResult.userData) userContent.data = skillResult.userData;
  //             break;
  //           } catch (error) {
  //             console.log("\x1b[31mERROR: skill " + result.skill + "\x1b[0m");
  //             console.log(error);
  //             throw null;
  //           }
  //         }
  //       }
  //     }
  //   }

  //   //Exeption of the closest competence
  //   if (!result.result && result.similarity < 0.2) {
  //     try {
  //       const skillResult = await require(__dirname + "/../skills/" + result.skill).execute({
  //         query,
  //         lang: result.lang,
  //         userData: userContent ? userContent.data : null,
  //         timeZone,
  //       });
  //       result.result = skillResult.text;
  //       result.shortAnswerExpected = !!skillResult.shortAnswerExpected;
  //       resData.data = skillResult.data;
  //       if (skillResult.userData) userContent.data = skillResult.userData;
  //     } catch (error) {
  //       console.log("\x1b[31mERROR: skill " + result.skill + "\x1b[0m");
  //       console.log(error);
  //       throw null;
  //     }
  //   }
  //   if (!result.result) {
  //     //Save if it's close, but not too close
  //     //This is used for logs
  //     if (result.similarity < 0.3) {
  //       saveQueryClose(result, query);
  //     }
  //     result.result = "Je n'ai pas compris ce que vous voulez dire";
  //   } else if (convExist) {
  //     fs.unlinkSync(__dirname + "/../data/sessions/" + convToken + ".json");
  //   }

  //   //Save data if Kara ask something to user
  //   if (resData.data) {
  //     if (!resData.lang) resData.lang = result.lang;
  //     if (!resData.skill) resData.skill = result.skill;
  //     resData.creationDate = new Date();
  //     const convToken = require("../utils/makeToken").generateToken({
  //       type: "data/sessions",
  //     });
  //     result.convToken = convToken;
  //     fs.writeFileSync(__dirname + "/../data/sessions/" + convToken + ".json", JSON.stringify(resData));
  //   }

  //   if (userToken) {
  //     fs.writeFileSync(__dirname + "/../data/users/users/" + userToken + ".json", JSON.stringify(userContent));
  //   }

  //   return result;
  // };
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
