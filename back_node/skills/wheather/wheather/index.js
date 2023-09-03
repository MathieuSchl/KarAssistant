const text = require("./text.json");
const cities = require("cities-list");
const getWheather = require("../../../utils/wheather/index").getWheather;
const replaceVariables = require("../../../utils/replaceVariables").replaceVariables;
const unit = { C: "Celsius", F: "Fahrenheit" };

/* Some cities are banned because the name is to close from a word in some language */
delete cities["Quel"]; // Quel temps fait il à Paris ?

module.exports.getCity = getCity;
function getCity(query) {
  const words = query.split(" ");
  for (const word of words) {
    if (word.length !== 0) {
      const testCity = word[0].toUpperCase() + word.slice(1);
      if (cities[testCity]) {
        return testCity;
      }
    }
  }

  return null;
}

module.exports.data = text;

module.exports.execute = async ({ query, lang, forceNoData, forceData }) => {
  //Lang unknown
  if (!text.response[lang]) return { text: text.error };

  const city = getCity(query);
  if (!city) return { text: text.response[lang].noCity, data: {}, shortAnswerExpected: true };
  return getCityWeather({ city, lang, forceNoData, forceData });
};

module.exports.getCityWeather = getCityWeather;
async function getCityWeather({ city, lang, forceNoData, forceData }) {
  const wheatherResult = await getWheather({ city, forceNoData, forceData });
  if (!wheatherResult) {
    const textResult = text.response[lang].noDataForCity;
    return {
      text: replaceVariables(textResult, { location: city }),
    };
  }
  const { location, temperature, humidity, windSpeed, imageUrl } = wheatherResult;

  const textResult = text.response[lang].wheatherIs;
  return {
    text: replaceVariables(textResult, {
      location,
      temperature,
      humidity,
      windSpeed,
      unit: unit["C"],
    }),
    metadata: { weatherImageUrl: imageUrl },
  };
}
