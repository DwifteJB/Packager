const { Client, Collection, Intents } = require("discord.js");
const client = new Client({ 
  presence: { activity: { name: 'with packages', type: 'PLAYING' }, status: 'online' }
});
const { owners, token } = require("./src/config.json");
const fs = require("fs");
const path = require("path");
const shell = require('shelljs')

client.login(token);
client.commands = new Collection();
client.prefix = '!'

console.log("Updating repos...");

fs.readdirSync("./repo_updaters").forEach(file => {
  shell.exec(`python3 ./repo_updaters/${file}`);
});
console.log("Reading jsons...");
for (const file of fs.readdirSync("./repos")) {
  const json = JSON.parse(fs.readFileSync(`./repos/${file}`, "utf8"));
  json.name = file.replace(".json", "");
  client.jsons.set(file, json);
}

// Command file setup
const folder = fs
  .readdirSync("src/commands")
    .filter(file => {
      return file.endsWith(".js");
    });
  console.log("╭────────────────────┬──╮");
  for (const file of folder) {
    try {
    const command = require(`./src/commands/${file}`);
    const boxCmdName = `${command.name}`.padEnd(20);
    console.log(`│${boxCmdName}│✅│`);
    console.log('├────────────────────┼──┤');
    client.commands.set(command.name, command);
    } catch (error) {
      const boxCmdName = `${file}`.padEnd(20);
      console.log(`│${boxCmdName}│❌│`);
      console.log(error)
    }
  }
console.log('╰────────────────────┴──╯');

fs.readdir("./src/events/", (err, files) => {
  if (err) return console.error;
  for (const file of files) {
    if (!file.endsWith(".js")) return;
    const evt = require(`./src/events/${file}`);
    let evtName = file.split(".")[0];
    client.on(evtName, evt.bind(null, client));
  };
  console.log(`Loaded ${files.length} events`)
});

