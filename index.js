// Modules
const Discord = require("discord.js");
const fs = require("fs");
const shell = require("shelljs");

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
  json.name = file.replace('.json','')
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
  if (message.content == "!update") {
    exec("git pull", (error, stdout, stderr) => {
      if (error) {
        message.channel.send(`Error: ${error}`);
        return;
      } else {
        message.channel.send(`${stdout}`);
        process.exit();
      }
    });
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
          .setTitle(`${repo.app[index].Name.trim()}`)
          .setTimestamp()
          .setFooter(
            repo.name,
            "https://pbs.twimg.com/profile_images/756727140779831297/-qWaC-UR_400x400.jpg"
        )
        if (repo.app[index].Maintainer.includes('Hayden Seay')) {
          lmao.addFields(
            {
              name: "Author",
              value: repo.app[index].Maintainer.replace(/ <(.*?)>/g, ""),
              inline: true
            }
          )
        } else {
          lmao.addFields(
            {
              name: "Author",
              value: repo.app[index].Author.replace(/ <(.*?)>/g, ""),
              inline: true
            }
          )
        }
          lmao.addFields(
            { name: "Version", value: repo.app[index].Version, inline: true },

            {
              name: "Repo",
              value: `[${repo.name}](http://dwifte.eu.org/repo.php?repo=${repo.url})`,
              inline: true
            },
            {
              name: "More info",
              value: `[Open in Sileo](http://dwifte.eu.org/open.php?package=${repo.app[index].Package})`,
              inline: true
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
        sent = true
        return;
      }
    }
  });
  if (!sent) message.channel.send("Sorry, we couldn't find that package.");
});

client.login(token);

