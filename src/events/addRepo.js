const fs = require("fs");

module.exports = async (client, repos) => {
  for (const file of fs.readdirSync("repos")) {
    const json = JSON.parse(fs.readFileSync(`repos/${file}`, "utf8"));
    json.name = file
      .replace(".json", "")
      .replace(/-/g, " ")
      .replace(/:/g, "/")
      .replace(/\'/g, "'");
    client.jsons.set(file, json);
  }

  client.packageCount = 0;
  client.jsons.forEach((repo) => {
    client.packageCount += repo.app.length;
  });
  client.user.setActivity(`${client.packageCount.toLocaleString()} packages`, {
    type: "WATCHING",
  });
};
