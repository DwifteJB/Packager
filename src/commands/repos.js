const { owners } = require("../config.json");
const haste = require("hastebin-gen");
const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");
module.exports = {

  Data: new SlashCommandBuilder()
    .setName("repos").setDescription("Shows all the repos currently on Packager"),
  async execute(client, message) {
    let repos = [];
    const folder = fs
      .readdirSync(path.join(global.rootFolder, "repos"))
      .filter((file) => file.endsWith(".json"));
    for (const file of folder) {


      repos.push(file.replace(".json", ""));
    }
    if (repos.join(", ").length > 1900) {
      haste(stdout, { extension: "txt", url: "https://hasteb.in" }).then(
        (haste) => message.reply("Output was too big: " + haste)
      );
    } else {

      message.reply(`\`\`\`\n${repos.join(", ")}\`\`\``);

    }
  },
};
