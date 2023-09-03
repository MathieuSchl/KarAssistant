const fs = require("fs");

describe("Make token", () => {
  test("Generate token", async () => {
    //Execute
    const result = require("../../utils/makeToken").generateToken({
      type: "data/sessions",
    });

    //Test
    expect(result != null).toBe(true);
  });

  test("Generate existing token", async () => {
    //Prepare
    const token = "test";
    fs.writeFileSync(
      __dirname + "/../../data/sessions/" + token + ".json",
      "test",
    );

    //Execute
    const result = require("../../utils/makeToken").generateToken({
      type: "data/sessions",
      token,
    });

    //Test
    expect(result != null).toBe(true);

    //Purge
    fs.unlinkSync(__dirname + "/../../data/sessions/" + token + ".json");
  });
});
