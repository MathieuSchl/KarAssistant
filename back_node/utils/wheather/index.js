const weatherJs = require("./weather-js").getWheather;

module.exports.getWheather = async ({ city, forceNoData }) => {
  if (!forceNoData) {
    const resultWeatherJs = await weatherJs({ city });
    if (resultWeatherJs && resultWeatherJs.length !== 0) {
      const cityResult = resultWeatherJs[0];

      const location = cityResult.location.name;
      const temperature = cityResult.current.temperature;
      const humidity = cityResult.current.humidity;
      const windSpeed = cityResult.current.windspeed;
      const imageUrl = cityResult.current.imageUrl;
      return { location, temperature, humidity, windSpeed, imageUrl };
    }
  }
  return null;
};
