describe("Skill kara/greetings", () => {
  test("Lang unknown", async () => {
    //Execute
    const result = require("../../../skills/kara/greetings/index").execute({
      lang: "not a language",
    });

    //Test
    expect(result.text).toBe("Undefined language for kara/greetings");
  });

  test("Greetings", async () => {
    //Execute
    const result = require("../../../skills/kara/greetings/index").execute({
      lang: "fr",
    });

    //Test
    expect(!!result.text).toBe(true);
  });
});
