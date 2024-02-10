const skiStationData = {
  test_good: {
    name: "Station valide",
    status: "Ouverte",
    locatioName: "alpes-du-nord",
    snowBot: 0,
    snowTop: 0,
    skiLiftOpen: 0,
    skiLiftTotal: 0,
    openTrack: 4,
    trackTotal: 0,
    max: 4,
    min: 1,
    totalTrack: 6,
  },
  test_not_good: {
    name: "Station NON valide",
    status: "Fermée",
    locatioName: "alpes-du-nord",
    snowBot: 0,
    snowTop: 0,
    skiLiftOpen: 0,
    skiLiftTotal: 0,
    openTrack: 4,
    trackTotal: 0,
    max: 4,
    min: 1,
    totalTrack: 6,
  },
};

// Importez le module dans votre test
jest.mock("../../../utils/wheather/skiinfo", () => ({
  data: skiStationData,
}));

describe("Skill wheather/wheather", () => {
  test("Lang unknown", async () => {
    //Execute
    const result = await require("../../../skills/wheather/wheather/index").execute({
      lang: "not a language",
    });

    //Test
    expect(result.text).toBe("Undefined language for wheather/wheather");
  });

  test("No city", async () => {
    //Execute
    const result = await require("../../../skills/wheather/wheather/index").execute({
      lang: "fr",
      query: "quel temps fait il à",
    });

    //Test
    expect(result.text.match("Quelle est la ville, dont vous souhaitez connaître la météo ?") != null).toBe(true);
  });

  test("No data for city", async () => {
    //Execute
    const result = await require("../../../skills/wheather/wheather/index").execute({
      lang: "fr",
      query: "quel temps fait il à paris",
      forceNoData: true,
    });

    //Test
    expect(result.text.match("Je n'ai pas de données") != null).toBe(true);
  });

  test("Get wheather", async () => {
    //Execute
    const result = await require("../../../skills/wheather/wheather/index").execute({
      lang: "fr",
      query: "quel temps fait il à paris",
      forceData: true,
    });

    //Test
    expect(result.text.match("il fait actuellement") != null).toBe(true);
  });

  test("Good station", async () => {
    //Execute
    const result = await require("../../../skills/wheather/wheather/index").execute({
      lang: "fr",
      query: "quel temps fait il à test_good",
      forceData: true,
    });

    //Test
    expect(result.text).toBe(
      "Dans la station Station valide la température, aujourd'hui, varie entre 1 et 4 degré Celsius. Il y a 0 remontée et 4 pistes d'ouvert."
    );
  });

  test("NOT good station", async () => {
    //Execute
    const result = await require("../../../skills/wheather/wheather/index").execute({
      lang: "fr",
      query: "quel temps fait il à test_not_good",
      forceData: true,
    });

    //Test
    expect(result.text).toBe(
      "La station Station NON valide est actuellement fermé et la température, aujourd'hui, varie entre 1 et 4 degré Celsius"
    );
  });
});
