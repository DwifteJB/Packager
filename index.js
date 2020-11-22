
// Modules
const Discord = require("discord.js");
const fs = require("fs");
const shell = require("shelljs");
const prefix = "!";
const { exec, spawn } = require("child_process")
const haste = require('hastebin-gen')

const client = new Discord.Client();

client.jsons = new Discord.Collection();

const { token, owners } = require("./config.json");

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
  if (commandName == "shell") {
    if(!owners.includes(message.author.id)) return;
    if (!args[0]) return message.channel.send('Please provide a command.');
    message.channel.send(`Running \`${args.join(" ")}\``);
    const cp = spawn(`${args[0]}`, args.slice(1), {
      detached: true
    });
    let output = ''
    cp.on('error', (err) => {
      return message.channel.send(`Failed to execute command. Error: \`\`\`${err}\`\`\``);
    });
    cp.stdout.on('data', (data) => {
      output += `${data}\n`
    })
    cp.on('close', (code) => {
      if (output.length < 1) return message.channel.send('Finished with no output.')
      if (output.length > 1994) {
        haste(output).then(haste => message.channel.send("Output was too big: " + haste))
      }
      else message.channel.send(`\`\`\`${output}\`\`\``);
    });
  }
  if (commandName == "addrepo") {
    if(!owners.includes(message.author.id)) return message.channel.send('Only the bot owners can use this command.')
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
    fs.writeFile(`./repo_updaters/${args[0]}.py`, `import random\nimport os\nimport csv\nimport json\nimport shutil\nimport time\nimport bz2\nimport sys\nimport smtplib\nfrom subprocess import Popen\nimport re\nimport requests\nurl = ${args[1]}\nprint(f'Downloading repo for {url}!')\ntry:\n    os.mkdir(f'{os.getcwd()}/repos')\n    os.mkdir(f'{os.getcwd()}/data')\nexcept:\n    pass\ntry:\n    headers={\n        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.47 Safari/537.36'\n    }\n    r = requests.get(f'{url}/Packages.bz2', headers=headers)\nexcept Exception as e:\n    print('Is this a repo?')\n    sys.exit(1)\nwith open(f'{os.getcwd()}/data/Packages.bz2', 'wb') as f:\n    f.write(r.content)\ntry:\n    zipfile = bz2.BZ2File('./data/Packages.bz2')\n    data = zipfile.read()\nexcept:\n    a = Popen(f'bzip2 -d ./data/Packages.bz2', shell=True)\n    while a is not None:\n            retcode = a.poll()\n            if retcode is not None:\n                print('Unzipped!')\n                data = open(f'{os.getcwd()}/data/Packages').read()\n                break\n    else:\n            time.sleep(1)\nfilepath = f'{os.getcwd()}//data/repo.csv'\nopen(filepath, 'wb').write(data)\nwith open(filepath, 'r+', errors='ignore') as lol:\n    try:\n        text = lol.read()\n    except Exception as e:\n        print(f'Error {e} occurred')\n    if re.search('/\ ', url):\n        text = re.sub('Filename: ./debs', f'Filename: {url}debs', text)\n        text = re.sub('Filename: ./deb', f'Filename: {url}deb', text)\n        text = re.sub('Filename: deb', f'Filename: {url}deb', text)\n        text = re.sub('Filename: debs', f'Filename: {url}debs', text)\n        text = re.sub('Filename: api', f'Filename: {url}api', text)\n        text = re.sub('Filename: pool', f'Filename: {url}pool', text)\n        text = re.sub('Filename: files', f'Filename: {url}files', text)\n    else:\n        text = re.sub('Filename: ./debs', f'Filename: {url}/debs', text)\n        text = re.sub('Filename: ./deb', f'Filename: {url}/deb', text)\n        text = re.sub('Filename: deb', f'Filename: {url}/deb', text)\n        text = re.sub('Filename: debs', f'Filename: {url}/debs', text)\n        text = re.sub('Filename: api', f'Filename: {url}/api', text)\n        text = re.sub('Filename: pool', f'Filename: {url}/pool', text)\n        text = re.sub('Filename: files', f'Filename: {url}/files', text)\n    lol.seek(0)\n    lol.write(text.replace('\0', ' '))\n    lol.truncate()\nfinal_data = {\n'url': f'{url}',\n'icon': f'{url}/CydiaIcon.png',\n'app': [],\n}\napp = {}\nwith open(f'{filepath}') as csvfile:\n    data = csv.reader(csvfile, delimiter=':')\n    for line in data:\n        if len(line) == 0:\n            final_data['app'].append(app)\n            app = {}\n            continue\n        try:\n            if line[1].strip() in ['http', 'https']:\n                line[1] = line[1] + ':' + line[2]\n        except:\n            pass\n        try:\n             app[line[0]] = line[1].strip()\n        except:\n             app[line[0]] = line[0].strip()\n      \njson_string = json.dumps(final_data)\nwith open(f'/root/PackageFinderJS/repos/${args[0]}.json', 'w') as f:\n    dat = json.dumps(final_data, indent=4)\n    f.write(dat)\n    f.close()\n    print('Done!')`, () => {})
    shell.exec(`git add repo_updaters && git commit -m "Added ${args[0]}" && git push`);
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

