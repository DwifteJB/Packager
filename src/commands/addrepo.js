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
    if (!args[0]) {
      const filter = m => m.author.id == message.author.id;
      message.channel.send('What is the name of this repo? Type `cancel` to cancel the process.');
      message.channel.awaitMessages(filter, { max: 1, time: 60000 }).then(collected => {
        if (collected.first().content.toLowerCase() == 'cancel') return message.channel.send('Cancelled!')
        message.channel.send('What is the URL of this repo? Type `cancel` to cancel the process.');
        message.channel.awaitMessages(filter, { max: 1, time: 60000 }).then(collected2 => {
        if (collected.first().content.toLowerCase() == 'cancel') return message.channel.send('Cancelled!') 
          else if (!/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/.test(collected2.first().content))
            return message.channel.send("Please provide a valid URL.");
        else {
            shell.exec(`python3 src/includes/add_repo.py ${collected.first().content.replace(/'/g, "\\'")} "${collected2.first().content}"`);
            // Load in new repo
            for (const file of fs.readdirSync("repos")) {
              const json = JSON.parse(fs.readFileSync(`repos/${file}`, "utf8"));
              json.name = file.replace(".json", "");
              console.log(`Reloaded ${json.name}`);
              client.jsons.set(file, json);
            }
            message.channel.send(`Added repo: \`${collected.first().content}\``);
          }
        })
      })
    } else {
      if (!args[1]) {
        return message.channel.send(`Please use the following syntax:\n\n\`\`\`${client.prefix}addrepo <Name> <URL>\`\`\``)
      }
      if (!/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/.test(args[1])) return message.channel.send("Please provide a valid URL.");
      shell.exec(`python3 src/includes/add_repo.py ${args[0]} "${args[1]}"`);

      // Load in new repo
      for (const file of fs.readdirSync("repos")) {
        const json = JSON.parse(fs.readFileSync(`repos/${file}`, "utf8"));
        json.name = file.replace(".json", "");
        console.log(`Reloaded ${json.name}`);
        client.jsons.set(file, json);
      }
      message.channel.send(`Added repo: \`${args[0]}\``);
    }
  }
};

