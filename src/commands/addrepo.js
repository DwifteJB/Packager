const { owners } = require("../config.json");
const haste = require("hastebin-gen");
const { exec } = require('child_process');
const shell = require("shelljs");
const fs = require('fs');

module.exports = {
  name: "addrepo",
  type: "private",
  async execute(client, message, args) {
    if (!owners.includes(message.author.id)) return;
    if (!args[1]) {
      return message.channel.send(`Please use the following syntax:\n\n\`\`\`${client.prefix}addrepo <Name> <URL>\`\`\``)
    }
    if (!/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/.test(args[1])) return message.channel.send("Please provide a valid URL.");
    shell.exec(`python3 src/includes/add_repo.py ${args[0]} "${args[1]}"`);

    // Load in new repo
    const json = JSON.parse(fs.readFileSync(`repos/${args[0]}.json`, "utf8"));
    json.name = args[0]
    console.log(`Reloaded ${json.name}`);
    client.jsons.set(args[0], json);
    
    message.channel.send(`Added repo: \`${args[0]}\``);

  }
};

