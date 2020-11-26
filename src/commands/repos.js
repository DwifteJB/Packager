const { owners } = require("../config.json");
const haste = require("hastebin-gen");
const { exec } = require("child_process");
const shell = require("shelljs");
const fs = require("fs");

module.exports = {
  name: "repos",
  type: "private",
  async execute(client, message, args) {
    if (!owners.includes(message.author.id)) return;
    exec(`ls repos`, (error, stdout, stderr) => {
      stdout = stdout.replace(/.json/g, "").replace(/-/g, " ");
      if (error)
        return message.channel.send(`There was an error: \`\`\`${error}\`\`\``);
      if (stdout.length < 1)
        return message.channel.send("No repositories added.");
      if (stdout.length > 1900) {
        haste(stdout, { extension: "txt", url: "https://hasteb.in" }).then(
          haste => message.channel.send("Output was too big: " + haste)
        );
      } else {
        message.channel.send(`\`\`\`\n${stdout}\`\`\``);
      }
    });
  }
};

