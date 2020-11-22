// Modules
const Discord = require("discord.js");
const fs = require("fs");
const shell = require("shelljs");
const prefix = "!";
const { exec } = require("child_process")
const haste = require('hastebin-gen')

const client = new Discord.Client();

client.jsons = new Discord.Collection();

const { token } = require("./config.json");

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

client.on("ready", () => {
  console.log(
    `Logged in as ${client.user.tag}\nIn ${client.guilds.cache.size} servers`
  );
  client.user.setStatus("online");
  client.user.setPresence({
    game: {
      name: "with Packages",
      type: "PLAYING"
    }
  });
});

client.on("guildCreate", guild => {
  let channelID;
  let channels = guild.channels.cache;

  channelLoop: for (let key in channels) {
    let c = channels[key];
    if (c[1].type === "text") {
      channelID = c[0];
      break channelLoop;
    }
  }

  let channel = guild.channels.cache.get(guild.systemChannelID || channelID);

  const lmao = new Discord.MessageEmbed()
    .setColor("#17bcb8")
    .setTitle("Packager is here!")
    .setDescription(
      "Thanks for inviting packager! The bot may not respond instantly as it might be updating the repos stored locally!\nYou can find packages by typing: [[TWEAK]]!"
    )
    .setTimestamp();
  channel.send(lmao);
});

client.on("message", async message => {
  const args = message.content
    .slice(prefix.length)
    .trim()
    .split(/ +/);
  const commandName = args.shift().toLowerCase();
  if (commandName == "addrepo") {
    if (!args[1]) {
      return message.channel.send(`Please use the following format:\n\n\`\`\`${prefix}addrepo <Name> <URL>\`\`\``)
    }
    if (!/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/.test(args[1])) return message.channel.send("Please provide a valid URL.");
    shell.exec(`python3 add_repo.py ${args[0]} "${args[1]}"`);

    for (const file of fs.readdirSync("./repos")) {
      const json = JSON.parse(fs.readFileSync(`./repos/${file}`, "utf8"));
      json.name = file.replace(".json", "");
      console.log(`Reloaded ${json.name}`);
      client.jsons.set(file, json);
    }
    message.channel.send(`Added repo: \`${args[0]}\``);

  }
  const matches = message.content.match(/\[\[([^\]\]]+)\]\]/);
  if (!matches) return;
  const package = matches[1];
  let sent = false;
  client.jsons.forEach(repo => {
    for (index in repo.app) {
      if (package === repo.app[index].Name) {
        const lmao = new Discord.MessageEmbed()
          .setColor("#17bcb8")
          .setDescription(repo.app[index].Description)
          .setAuthor(`${repo.app[index].Name.trim()}`)
          .setTimestamp()
          .setFooter(repo.name, repo.icon);
        if (repo.app[index].Maintainer.includes("Hayden Seay")) {
          lmao.addFields({
            name: "Author",
            value: repo.app[index].Maintainer.replace(/ <(.*?)>/g, ""),
            inline: true
          });
        } else {
          lmao.addFields({
            name: "Author",
            value: repo.app[index].Author.replace(/ <(.*?)>/g, ""),
            inline: true
          });
        }
        lmao.addFields(
          { name: "Version", value: repo.app[index].Version, inline: true },

          {
            name: "Repo",
            value: `[${repo.name}](http://dwifte.eu.org/repo.php?repo=${repo.url})`,
            inline: true
          },
          {
            name: "Bundle ID",
            value: repo.app[index].Package
          },
          {
            name: "More info",
            value: `[Open in Sileo](http://dwifte.eu.org/open.php?package=${repo.app[index].Package})`
          }
        );

        try {
          message.channel.send(lmao.setThumbnail(repo.app[index].Icon));
        } catch (error) {
          message.channel.send(
            lmao.setThumbnail(`https://i.imgur.com/p9NJCoU.png`)
          );

          console.log(error);
        }
        sent = true;
        return;
      }
    }
  });
  if (!sent) message.channel.send("Sorry, I couldn't find that package.");
});

client.login(token);

