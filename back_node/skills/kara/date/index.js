module.exports.data = require("./text.json");

module.exports.execute = (data) => {
  const date = new Date();
  const hours = ("0" + date.getHours()).slice(-2);
  const minutes = ("0" + date.getMinutes()).slice(-2);
  switch (data.lang) {
    case "en":
      const dayNameEn = date.toLocaleString("en-us", { weekday: "long" });
      const monthNameEn = date.toLocaleString("en-us", { month: "long" });
      const ampm = hours >= 12 ? "pm" : "am";
      let hours12 = hours % 12;
      hours12 = hours12 ? hours12 : 12; // the hour '0' should be '12'
      return `The date today is: ${dayNameEn} ${monthNameEn} ${date.getDate()} ${date.getFullYear()} and it is ${hours12}:${minutes} ${ampm}`;

    case "fr":
      const dayNameFr = date.toLocaleString("fr-fr", { weekday: "long" });
      const monthNameFr = date.toLocaleString("fr-fr", { month: "long" });
      return `Aujourd'hui nous sommes le ${dayNameFr} ${date.getDate()} ${monthNameFr} ${date.getFullYear()} et il est ${hours} heure ${minutes}`;

    default:
      return `Undefined language for date`;
  }
};
