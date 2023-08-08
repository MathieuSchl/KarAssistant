module.exports.data = {
  phrases: {
    en: [
      "who are you",
      "can you introduce yourself",
      "could you tell me who you are",
      "Could you describe yourself to me",
      "Would you mind giving me a brief self-introduction",
    ],
    fr: [
      "qui est tu",
      "peux-tu te présenter",
      "peux-tu me dire qui tu es",
      "pourrais-tu me décrire qui tu es",
      "est-ce que tu pourrais te présenter brièvement",
      "t'es qui toi",
    ],
  },
};

module.exports.execute = (data) => {
  switch (data.lang) {
    case "en":
      return `Hi my name is Kara. I'm a personal assistant developed by Cody and Caz. Ask me a question and I'll answer it.`;

    case "fr":
      return `Mon nom est Kara. Je suis un assistant personnel dévellopé par Cody et Caz. Posez moi, une question et j'y répondrais.`;

    default:
      return `Undefined language for whoiam`;
  }
};
