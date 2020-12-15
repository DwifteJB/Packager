const { Client, Collection, Intents } = require("discord.js");
const client = new Client({
  restTimeOffset: 250,
  ws: {
    properties: { $browser: 'Discord iOS' }
  }
});
const { owners, token } = require("./src/config.json");
const fs = require("fs");
const path = require("path");
const shell = require('shelljs')
const { exec } = require('child_process')
exec('rm -rf repos')

client.login(token);
client.commands = new Collection();
client.prefix = '!'
client.jsons = new Collection();
client.cooldowns = new Collection();
client.saves = new Collection()

console.log("Updating repos...");
shell.exec('mkdir ./repos');

fs.readdirSync("./repo_updaters").forEach(file => {
  shell.exec(`python3 "./repo_updaters/${file}"`);
});

console.log("Reading jsons...");
for (const file of fs.readdirSync("./repos")) {
  const json = JSON.parse(fs.readFileSync(`./repos/${file}`, "utf8"));
  json.name = file.replace(".json", "").replace(/-/g, ' ').replace(/:/g, '/').replace(/\'/g, "'");
  client.jsons.set(file, json);
}

client.packageCount = 0
client.jsons.forEach(repo => {  
  client.packageCount += repo.app.length
})

setInterval(() => {
  client.emit('addRepo', '')
}, 60000 * 60)

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
})

