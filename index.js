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
    exec(
      `echo 'import random
import os
import csv
import json
import shutil
import time
import bz2
import sys
import smtplib
from subprocess import Popen
import re
import requests
url = "${args[1]}"
print(f"Downloading repo for {url}!")
try:
    os.mkdir(f"{os.getcwd()}/repos")
    os.mkdir(f"{os.getcwd()}/data")
except:
    pass
try:
    headers={
        \'User-Agent\': \'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.47 Safari/537.36\'
    }
    r = requests.get(f"{url}/Packages.bz2", headers=headers)
except Exception as e:
    print("Is this a repo?")
    sys.exit(1)
with open(f\'{os.getcwd()}/data/Packages.bz2\', \'wb\') as f:
    f.write(r.content)
try:
    zipfile = bz2.BZ2File("./data/Packages.bz2")
    data = zipfile.read()
except:
    a = Popen(f"bzip2 -d ./data/Packages.bz2", shell=True)
    while a is not None:
            retcode = a.poll()
            if retcode is not None:
                print("Unzipped!")
                data = open(f"{os.getcwd()}/data/Packages").read()
                break
    else:
            time.sleep(1)

filepath = f"{os.getcwd()}//data/repo.csv"
open(filepath, \'wb\').write(data)
with open(filepath, \'r+\', errors=\'ignore\') as lol:
    try:
        text = lol.read()
    except Exception as e:
        print(f"Error {e} occurred")
    if re.search(\'/\ \', url):
        text = re.sub(\'Filename: ./debs\', f\'Filename: {url}debs\', text)
        text = re.sub(\'Filename: ./deb\', f\'Filename: {url}deb\', text)
        text = re.sub(\'Filename: deb\', f\'Filename: {url}deb\', text)
        text = re.sub(\'Filename: debs\', f\'Filename: {url}debs\', text)
        text = re.sub(\'Filename: api\', f\'Filename: {url}api\', text)
        text = re.sub(\'Filename: pool\', f\'Filename: {url}pool\', text)
        text = re.sub(\'Filename: files\', f\'Filename: {url}files\', text)
    else:
        text = re.sub(\'Filename: ./debs\', f\'Filename: {url}/debs\', text)
        text = re.sub(\'Filename: ./deb\', f\'Filename: {url}/deb\', text)
        text = re.sub(\'Filename: deb\', f\'Filename: {url}/deb\', text)
        text = re.sub(\'Filename: debs\', f\'Filename: {url}/debs\', text)
        text = re.sub(\'Filename: api\', f\'Filename: {url}/api\', text)
        text = re.sub(\'Filename: pool\', f\'Filename: {url}/pool\', text)
        text = re.sub(\'Filename: files\', f\'Filename: {url}/files\', text)
    lol.seek(0)
    lol.write(text.replace(\'\0\', \' \'))
    lol.truncate()

final_data = {
\'url\': f\'{url}\',
\'icon\': f\'{url}/CydiaIcon.png\',
\'app\': [],
}
app = {}

with open(f\'{filepath}\') as csvfile:
    data = csv.reader(csvfile, delimiter=\':\')
    for line in data:
        if len(line) == 0:
            final_data[\'app\'].append(app)
            app = {}
            continue
        try:
            if line[1].strip() in [\'http\', \'https\']:
                line[1] = line[1] + \':\' + line[2]
        except:
            pass
        try:
             app[line[0]] = line[1].strip()
        except:
             app[line[0]] = line[0].strip()

      
json_string = json.dumps(final_data)

with open(\'/root/PackageFinderJS/repos/${args[0]}.json\', \'w\') as f:
    dat = json.dumps(final_data, indent=4)
    f.write(dat)
    f.close()
    print("Done!")' > repo_updaters/${args[0]}.py`, async (error, stdout, stderr) => {
          stdout = stdout.replace(/deb /g, '').replace(/ \.\//g,'')
        if (error) {
        const errorMsg = await haste(error, { extension: "txt", url: "https://hasteb.in" })
        message.channel.send("Output was too big: " + errorMsg)
        }
        if (stdout) {
            haste(stdout, { extension: "txt", url: "https://hasteb.in" }).then(haste => message.channel.send("Output was too big: " + haste))
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
        //return;
      }
    }
  });
  if (!sent) message.channel.send("Sorry, I couldn't find that package.");
});

client.login(token);

