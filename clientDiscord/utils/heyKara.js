const axios = require("axios");
const { stringify } = require("qs");
const fs = require("fs");
const api = axios.create({
  paramsSerializer: {
    serialize: stringify, // or (params) => Qs.stringify(params, {arrayFormat: 'brackets'})
  },
});
const getPassPhrase = require("./getPassPhrase").getPassPhrase;

module.exports.makeRequest = makeRequest;
async function makeRequest({ query, clientToken, passPhrase }) {
  return await new Promise((resolve, reject) => {
    api({
      method: "GET",
      headers: { "Content-Type": "application/json" },
      params: {
        query,
        clientToken,
        passPhrase,
      },
      url: process.env.BACK_URL + "/api/heyKara",
    })
      .then(function (response) {
        if (response.status !== 200) throw "Create new client status : " + response.status;

        return resolve(response.data);
      })
      .catch(function (error) {
        if (error.code === "ECONNREFUSED") resolve({ err: "Access to the Kara server cannot be established" });
        if (error.response && error.response.status === 403) resolve({ err: "Access to the Kara server is forbidden" });
        else {
          console.log(error);
          resolve({ err: error.code });
        }
      });
  });
}

module.exports.heyKara = heyKara;
async function heyKara({ userName, userId, messageContent, avatarUrl }) {
  const { err, clientToken, passPhrase } = await getPassPhrase({ userId, userName, avatarUrl });
  if (err) return err;
  const data = passPhrase
    ? await makeRequest({ query: messageContent, clientToken, passPhrase })
    : { clientExist: false };
  if (data.errRequest) return data.errRequest;
  const resultPhrase = data.result;

  if (!data.clientExist) {
    fs.unlinkSync(__dirname + "/../data/clients/" + userId + ".json");
    return heyKara({ userName, userId, messageContent, avatarUrl });
  }

  return resultPhrase;
}
