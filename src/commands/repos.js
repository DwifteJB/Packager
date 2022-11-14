const { owners } = require("../config.json");
const haste = require("hastebin-gen");
const fs = require("fs");
const path = require("path")
module.exports = {
  name: "repos",
  type: "private",
  async execute(client, message, args) {
    if (!owners.includes(message.author.id)) return;
    let repos = []
    const folder = fs.readdirSync(path.join(global.rootFolder,"repos")).filter(file => file.endsWith('.json'));
    for (const file of folder) {
      repos.push(file.replace(".json",""))
    }
    if (repos.join(", ").length > 1900) {
      haste(stdout, { extension: "txt", url: "https://hasteb.in" }).then(
        haste => message.reply("Output was too big: " + haste)
      );
    } else {
      message.reply(`\`\`\`\n${repos.join(", ")}\`\`\``);
    }
  
  }
};

