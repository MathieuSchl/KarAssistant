const weather = require("weather-js");

module.exports.getWheather = async ({ city }) => {
  const { err, result } = await new Promise((resolve) => {
    weather.find(
      { search: city, timeout: 2500, degreeType: "C" },
      function (err, result) {
        resolve({ err, result: result });
      },
    );
  });
  /* c8 ignore start */
  if (err) return null;
  /* c8 ignore stop */

  return result;
};
