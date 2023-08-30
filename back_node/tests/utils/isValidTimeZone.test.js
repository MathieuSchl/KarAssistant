const fs = require("fs");

describe("Valid time zone", () => {
  test("Time zone valid", async () => {
    //Execute
    const result = require("../../utils/isValidTimeZone").isValidTimeZone("Europe/Paris");

    //Test
    expect(result).toBe(
      true,
    );
  });

  test("Time zone invalid", async () => {
    //Execute
    const result = require("../../utils/isValidTimeZone").isValidTimeZone("Not a time zone");

    //Test
    expect(result).toBe(
      false,
    );
  });

  test("Time zone undefined", async () => {
    //Execute
    const result = require("../../utils/isValidTimeZone").isValidTimeZone();

    //Test
    expect(result).toBe(
      false,
    );
  });
});
