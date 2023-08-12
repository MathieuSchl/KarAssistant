module.exports.data = require("./text.json");

module.exports.execute = (data) => {
  switch (data.lang) {
    case "en":
      return {
        text: `Hi my name is Kara. I'm a personal assistant developed by Cody and Caz. Ask me a question and I'll answer it.`,
      };

    case "fr":
      return {
        text: `Mon nom est Kara. Je suis un assistant personnel dévellopé par Cody et Caz. Posez-moi une question et j'y répondrais.`,
      };

    default:
      return { text: `Undefined language for whoareyou` };
  }
};
