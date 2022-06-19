import {Client, Collection, Intents} from 'discord.js';
const client = new Client({
  restTimeOffset: 250,
  ws: {
    properties: { $browser: 'Discord iOS' }
  },intents: [
      Intents.FLAGS.GUILDS, 
      Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS, 
      Intents.FLAGS.GUILD_MESSAGES, 
      Intents.FLAGS.GUILD_MESSAGE_REACTIONS]
});
import * as fs from 'fs';
import {createRequire} from "module";
const { token, skip } = JSON.parse(fs.readFileSync("./src/config.json"));
import {exec} from 'child_process';
import {RepoUpdater} from './src/includes/repoUpdate.js'
exec('rm -rf repos')
const require = createRequire(import.meta.url)

client.login(token);
client.commands = new Collection();
client.prefix = '!'
client.jsons = new Collection();
client.cooldowns = new Collection();
client.saves = new Collection()

console.log("Updating repos...");
try {
  fs.rmSync(path,"./repos",{recursive:true,force:true});
} catch(e){}
try {
  fs.mkdirSync("./repos");
} catch(e){}
async function loadJSON() {
  if (skip == false) { 
    //
    // fs.readdirSync("./repo_updaters").forEach(file => {
    //   console.log(`[PARSING]: ${file}`)
    //   shell.exec(`python3 "./repo_updaters/${file}"`);
    // });
    const repos = JSON.parse(fs.readFileSync("./src/repos.json"))
    for (var repo in repos) {
      console.log("Updating repo: " + repo)
      await RepoUpdater(repo,repos[repo]);
    }
  }

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

  return new Promise(resolve => {
      resolve('resolved');
  });
}
loadJSON();
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

