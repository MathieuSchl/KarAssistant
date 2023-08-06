module.exports.data = {
  phrases: { fr: ["quelle jour est-on", "on est quelle jour"] },
};

module.exports.execute = (data) => {
  const date = new Date();
  switch (data.lang) {
    case "fr":
      const dayNameFr = date.toLocaleString("fr-fr", { weekday: "long" });
      const monthNameFr = date.toLocaleString("fr-fr", { month: "long" });
      return `Aujourd'hui nous sommes le ${dayNameFr} ${date.getDate()} ${monthNameFr} ${date.getFullYear()} et il est ${date.getHours()} heure ${date.getMinutes()}`;

    default:
      return `Undefined language for date`;
  }
};
