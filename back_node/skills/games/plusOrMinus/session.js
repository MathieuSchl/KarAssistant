module.exports.execute = ({ query, lang, data }) => {
  if (/^\d+?$/.test(query)) {
    const userValue = parseInt(query);
    const gameTarget = data.randomNumber;
    if (userValue === gameTarget) {
      switch (lang) {
        case "en":
          return { text: `Congratulations, you found the right value : ` + gameTarget };

        case "fr":
          return { text: `Bravo, vous avez trouvé la bonne valeur : ` + gameTarget };

        default:
          return { text: `Undefined language for gessTheNumber/session` };
      }
    } else if (userValue < gameTarget) {
      switch (lang) {
        case "en":
          return { text: `My number is greater than ` + userValue, data };

        case "fr":
          return { text: `Mon nombre est plus grande que ` + userValue, data };

        default:
          return { text: `Undefined language for gessTheNumber/session` };
      }
    } else if (userValue > gameTarget) {
      switch (lang) {
        case "en":
          return { text: `My number is smaller  than ` + userValue, data };

        case "fr":
          return { text: `Mon nombre est plus petit que ` + userValue, data };

        default:
          return { text: `Undefined language for gessTheNumber/session` };
      }
    }
  }
};
