const text = require("./text.json");
const cities = require("cities-list");
const weather = require('weather-js');
const replaceVariables =
  require("../../../utils/replaceVariables").replaceVariables;
  const unit = { "C":"Celsius", "F": "Fahrenheit" }

/* Some cities are banned because the name is to close from a word in some language */
delete cities["Quel"] // Quel temps fait il à Paris ?

function getCity(query){
  const words = query.split(" ");
  for (const word of words) {
    const testCity = word[0].toUpperCase() + word.slice(1);
    if(cities[testCity]){
      return testCity;
    }
  }

  return null;
}

module.exports.data = text;

module.exports.execute = async(data) => {
  //Lang unknown
  if (!text.response[data.lang]) return { text: text.error };

  const city = getCity(data.query)

  if (!city) return { text: text.response[data.lang].noCity };
  
  const {err, result} = await new Promise((resolve) => {
    weather.find({search: city, timeout:2500, degreeType: 'C'}, function(err, result) {
      resolve({err, result: result});
    });
  });
  if(err || data.forceNoData) {
    const textResult = text.response[data.lang].noDataForCity;
    return {
      text: replaceVariables(textResult, { location: city })
    };
   }
 

  const cityResult=result[0];

  const location = cityResult.location.name;
  const temperature = cityResult.current.temperature;
  const humidity = cityResult.current.humidity;
  const windSpeed = cityResult.current.windspeed;
  const imageUrl = cityResult.current.imageUrl;

  const textResult = text.response[data.lang].wheatherIs;
  return {
    text: replaceVariables(textResult, { location, temperature, humidity, windSpeed, unit: unit["C"] }),
    metadata: {weatherImageUrl:imageUrl}
  };
};
