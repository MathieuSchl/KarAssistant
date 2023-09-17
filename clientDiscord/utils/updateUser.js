const fs = require("fs");
const encryptData = require("./RSA").encryptData;
const { stringify } = require("qs");
const axios = require("axios");
const api = axios.create({
  paramsSerializer: {
    serialize: stringify, // or (params) => Qs.stringify(params, {arrayFormat: 'brackets'})
  },
});

async function updateUserRequest({ data, clientToken }) {
  return await new Promise((resolve, reject) => {
    api({
      method: "PUT",
      headers: { "Content-Type": "application/json", karaeatcookies: clientToken },
      params: {
        data,
      },
      url: process.env.BACK_URL + "/api/user",
    })
      .then(function (response) {
        if (response.status !== 200) throw "Put user : " + response.status;

        return resolve(true);
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
          console.log(error);
          return resolve({ err: error.code, status: error.response ? error.response.status : 420 });
        }
      });
  });
}

module.exports.updateUser = updateUser;
async function updateUser({ userName, userId, data, retry = 0 }) {
  const userExist = fs.existsSync(__dirname + "/../data/clients/" + userId + ".json");
  if (!userExist) return false;
  const userData = JSON.parse(fs.readFileSync(__dirname + "/../data/clients/" + userId + ".json", "utf8"));

  const clientToken = userData.clientToken;
  const dataEncrypted = await encryptData({
    data,
    publicKey: userData.publicKey,
  });
  const dataRequest = await updateUserRequest({ data: dataEncrypted, clientToken });

  if (dataRequest !== true) {
    if (retry !== 0) return false;
    retry++;
    return updateUser({ userName, userId, data, retry });
  }

  fs.writeFileSync(__dirname + "/../data/clients/" + userId + ".json", JSON.stringify(userData));

  return true;
}
