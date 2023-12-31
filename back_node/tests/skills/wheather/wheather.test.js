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
});
