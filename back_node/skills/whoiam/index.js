module.exports.data = {
  phrases: {
    en: ["who are you"],
    fr: ["qui est tu"],
  },
};

module.exports.execute = (data) => {
  switch (data.lang) {
    case "en":
      return `Hi my name is Kara`;

    case "fr":
      return `Mon nom est Kara`;

    default:
      return `Undefined language for whoiam`;
  }
};
