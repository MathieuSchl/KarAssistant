const weather = require("./index");

module.exports.execute = async ({ query, lang, data }) => {
  const city = weather.getCity(query);
  if (!city) return null;

  return await weather.execute({ query, lang });
};
