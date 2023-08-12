module.exports.data = require("./text.json");

module.exports.execute = (data) => {
  const randomNumber = Math.floor(Math.random() * 100);
  const resData = { randomNumber };
  switch (data.lang) {
    case "en":
      return { text: `I have a number in my mind 0 and 100 try to find it`, data: resData };

    case "fr":
      return { text: `J'ai un nombre en tête 0 et 100 essaye de le trouver`, data: resData };

    default:
      return { text: `Undefined language for gessTheNumber` };
  }
};
