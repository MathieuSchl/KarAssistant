module.exports.data = require("./text.json");

module.exports.execute = (data) => {
  const date = new Date();
  const hours = ("0" + date.getHours()).slice(-2);
  const minutes = ("0" + date.getMinutes()).slice(-2);
  switch (data.lang) {
    case "en":
      const ampm = hours >= 12 ? "pm" : "am";
      let hours12 = hours % 12;
      hours12 = hours12 ? hours12 : 12; // the hour '0' should be '12'
      return { text: `It is ${hours12}:${minutes} ${ampm}` };

    case "fr":
      return { text: `Il est ${hours} heure ${minutes}` };

    default:
      return { text: `Undefined language for time` };
  }
};
