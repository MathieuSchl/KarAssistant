const fs = require("fs");

describe("Garbage session collector", () => {
  test("session valid", async () => {
    //Prepare
    fs.writeFileSync(
      __dirname + "/../../data/sessions/test.txt",
      JSON.stringify({ date: new Date() }),
    );

    //Execute
    require("../../cron/garbageSessionCollector").garbageSessionCollector();

    //Test
    expect(fs.existsSync(__dirname + "/../../data/sessions/test.txt")).toBe(
      true,
    );

    //Purge
    fs.unlinkSync(__dirname + "/../../data/sessions/test.txt");
  });

  test("session expired", async () => {
    //Prepare
    fs.writeFileSync(
      __dirname + "/../../data/sessions/test.txt",
      JSON.stringify({ date: new Date("2000-01-01") }),
    );

    //Execute
    require("../../cron/garbageSessionCollector").garbageSessionCollector();

    //Purge
    expect(fs.existsSync(__dirname + "/../../data/sessions/test.txt")).toBe(
      false,
    );
  });
});
