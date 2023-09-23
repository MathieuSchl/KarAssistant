const axios = require("axios");
const { stringify } = require("qs");
const fs = require("fs");
const api = axios.create({
  paramsSerializer: {
    serialize: stringify, // or (params) => Qs.stringify(params, {arrayFormat: 'brackets'})
  },
});
const prepareRequest = require("./prepareRequest").prepareRequest;
const decryptResult = require("./prepareRequest").decryptResult;

module.exports.makeRequest = makeRequest;
async function makeRequest({ query, clientToken, data }) {
  return await new Promise((resolve, reject) => {
    api({
      method: "GET",
      headers: { "Content-Type": "application/json", karaeatcookies: clientToken },
      params: {
        data,
      },
      url: process.env.BACK_URL + "/api/heyKara",
    })
      .then(function (response) {
        if (response.status !== 200) throw "Create new client status : " + response.status;

        return resolve(response.data);
      })
      .catch(function (error) {
        if (error.code === "ECONNREFUSED")
          resolve({ err: "Access to the Kara server cannot be established", status: 420 });
        if (error.response && error.response.status === 403)
          resolve({ err: "Access to the Kara server is forbidden", status: error.response.status });
        else if (error.response && error.response.status === 404)
          return resolve({ err: "User does not exist", status: error.response.status });
        if (error.response && error.response.status === 500)
          resolve({ err: "Kara as an internal error", status: error.response.status });
        else {
          resolve({ err: error.code, status: error.response ? error.response.status : 420 });
        }
      });
  });
}

module.exports.heyKara = heyKara;
async function heyKara({ userName, userId, messageContent, avatarUrl, retry = 0 }) {
  const { err, clientToken, data, publicKey } = await prepareRequest({ userId, userName, avatarUrl, messageContent });
  if (err) return err;
  const dataRequest = data ? await makeRequest({ query: messageContent, clientToken, data }) : { clientExist: false };
  if (dataRequest.err && retry != 0) return dataRequest.err;

  if (!dataRequest || dataRequest.err) {
    if (dataRequest && dataRequest.status === 404) fs.unlinkSync(__dirname + "/../data/clients/" + userId + ".json");
    retry++;
    return heyKara({ userName, userId, messageContent, avatarUrl, retry });
  }

  const resultDecrypted = data
    ? await decryptResult({ data: dataRequest, publicKey })
    : { result: "Error with the request" };

  const phraseResult = resultDecrypted.result;
  return phraseResult;
}
