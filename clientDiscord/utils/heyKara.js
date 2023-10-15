const axios = require("axios");
const { stringify } = require("qs");
const fs = require("fs");
const api = axios.create({
  paramsSerializer: {
    serialize: stringify, // or (params) => Qs.stringify(params, {arrayFormat: 'brackets'})
  },
});
const prepareRequest = require("./prepareRequest").prepareRequest;
const decryptionForResult = require("../utils/encryption").decryptionForResult;

module.exports.makeRequest = makeRequest;
async function makeRequest({ clientToken, data }) {
  return await new Promise((resolve, reject) => {
    api({
      method: "GET",
      headers: { "Content-Type": "application/json", karaeatcookies: clientToken },
      params: data,
      url: process.env.BACK_URL + "/api/heyKara",
    })
      .then(function (response) {
        if (response.status !== 200) throw "Create new client status : " + response.status;

        return resolve(response.data);
      })
      .catch(function (error) {
        if (error.code === "ECONNREFUSED")
          return resolve({ err: "Access to the Kara server cannot be established", status: 420 });
        else if (error.response && error.response.status === 403)
          return resolve({ err: "Access to the Kara server is forbidden", status: error.response.status });
        else if (error.response && error.response.status === 404)
          return resolve({ err: "User does not exist", status: error.response.status });
        else if (error.response && error.response.status === 500)
          return resolve({ err: "Kara as an internal error", status: error.response.status });
        else {
          return resolve({ err: error.code, status: error.response ? error.response.status : 420 });
        }
      });
  });
}

module.exports.heyKara = heyKara;
async function heyKara({ userName, userId, messageContent, avatarUrl, retry = 0 }) {
  const { err, clientToken, data, clientPrivateKey } = await prepareRequest({
    userId,
    userName,
    avatarUrl,
    messageContent,
  });
  if (err) return err;

  const dataRequest = data ? await makeRequest({ clientToken, data }) : { clientExist: false };
  if (dataRequest.err && retry != 0) return dataRequest.err;

  if (!dataRequest || dataRequest.err) {
    if (dataRequest && (dataRequest.status === 404 || dataRequest.status === 406))
      fs.unlinkSync(__dirname + "/../data/clients/" + userId + ".json");
    retry++;
    return heyKara({ userName, userId, messageContent, avatarUrl, retry });
  }

  const resultDecrypted = await decryptionForResult({ clientPrivateKey, data: dataRequest });
  const phraseResult = resultDecrypted.result;
  return phraseResult;
}
