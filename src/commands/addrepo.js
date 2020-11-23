const { owners } = require("../config.json");
const haste = require("hastebin-gen");
const { exec } = require('child_process');
const shell = require("shelljs");

module.exports = {
  name: "addrepo",
  type: "private",
  async execute(client, message, args) {
    if (!owners.includes(message.author.id)) return;
    if (!args[1]) {
      return message.channel.send(`Please use the following syntax:\n\n\`\`\`${client.prefix}addrepo <Name> <URL>\`\`\``)
    }
    if (!/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/.test(args[1])) return message.channel.send("Please provide a valid URL.");
    shell.exec(`python3 add_repo.py ${args[0]} "${args[1]}"`);

    for (const file of fs.readdirSync("../../repos")) {
      const json = JSON.parse(fs.readFileSync(`../../repos/${file}`, "utf8"));
      json.name = file.replace(".json", "");
      console.log(`Reloaded ${json.name}`);
      client.jsons.set(file, json);
    }
    message.channel.send(`Added repo: \`${args[0]}\``);

  }
};

