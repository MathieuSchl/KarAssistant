module.exports.data = {
  phrases: {
    en: [
      "what time is it",
      "could you tell me the time",
      "do you have the time",
      "do you know what time it is",
      "can you tell me what time it is",
      "could you let me know the time",
    ],
    fr: [
      "quelle heure est-il",
      "peux-tu me donner l'heure",
      "pourrais-je connaître l'heure actuelle",
      "est-ce que vous pouvez me dire l'heure qu'il est",
      "tu sais quelle heure il est",
    ],
  },
};

module.exports.execute = (data) => {
  const date = new Date();
  const hours = ("0" + date.getHours()).slice(-2);
  const minutes = ("0" + date.getMinutes()).slice(-2);
  switch (data.lang) {
    case "en":
      const ampm = hours >= 12 ? "pm" : "am";
      let hours12 = hours % 12;
      hours12 = hours12 ? hours12 : 12; // the hour '0' should be '12'
      return `It is ${hours12}:${minutes} ${ampm}`;

    case "fr":
      return `Il est ${hours} heure ${minutes}`;

    default:
      return `Undefined language for time`;
  }
};
