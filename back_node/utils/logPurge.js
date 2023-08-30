const fs = require("fs");

module.exports.logPurge = (params) => {
  const force = params ? params.force : false;
  const nowDate = new Date();
  const logsFiles = fs.readdirSync(__dirname + "/../logs/");
  for (const logsFile of logsFiles) {
    const stats = fs.statSync(__dirname + "/../logs/" + logsFile);
    const mtime = stats.mtime;
    const differenceInTime = nowDate.getTime() - mtime.getTime();
    const differenceInDay = differenceInTime / (1000 * 3600 * 24);
    if (differenceInDay > 7 || force) fs.unlinkSync(__dirname + "/../logs/" + logsFile);
  }
};
