const fs = require("fs");

describe("Garbage session collector", () => {
  test("session valid", async () => {
    //Prepare
    fs.writeFileSync(
      __dirname + "/../../data/sessions/test.txt",
      JSON.stringify({ creationDate: new Date() }),
    );

    //Execute
    require("../../cron/garbageFilesCollector").garbageFilesCollector();

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
      JSON.stringify({ creationDate: new Date("2000-01-01") }),
    );

    //Execute
    require("../../cron/garbageFilesCollector").garbageFilesCollector();

    //Purge
    expect(fs.existsSync(__dirname + "/../../data/sessions/test.txt")).toBe(
      false,
    );
  });

  test("user valid", async () => {
    //Prepare
    const dateNow = new Date();
    fs.writeFileSync(
      __dirname + "/../../data/users/users/test.txt",
      JSON.stringify({ creationDate: dateNow, lastRequestDate: dateNow }),
    );

    //Execute
    require("../../cron/garbageFilesCollector").garbageFilesCollector();

    //Purge
    expect(fs.existsSync(__dirname + "/../../data/users/users/test.txt")).toBe(
      true,
    );
  });

  test("user expired", async () => {
    //Prepare
    const dateNow = new Date("2000-01-01");
    fs.writeFileSync(
      __dirname + "/../../data/users/users/test.txt",
      JSON.stringify({ creationDate: dateNow, lastRequestDate: dateNow }),
    );

    //Execute
    require("../../cron/garbageFilesCollector").garbageFilesCollector();

    //Purge
    expect(fs.existsSync(__dirname + "/../../data/users/users/test.txt")).toBe(
      false,
    );
  });

  test("active user", async () => {
    //Prepare
    const creationDate = new Date("2000-01-01");
    const lastRequestDate = new Date("2001-01-01");
    fs.writeFileSync(
      __dirname + "/../../data/users/users/test.txt",
      JSON.stringify({ creationDate, lastRequestDate }),
    );

    //Execute
    require("../../cron/garbageFilesCollector").garbageFilesCollector();

    //Purge
    expect(fs.existsSync(__dirname + "/../../data/users/users/test.txt")).toBe(
      true,
    );
  });
});
