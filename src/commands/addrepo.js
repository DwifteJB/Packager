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
      message.channel.awaitMessages(filter, { max: 1, time: 60000 }).then(async collected => {
        if (collected.first().content.toLowerCase() == 'cancel') return message.channel.send('Cancelled!')
        message.channel.send('What is the URL of this repo? Type `cancel` to cancel the process.');
        message.channel.awaitMessages(filter, { max: 1, time: 60000 }).then(async collected2 => {
          if (collected.first().content.toLowerCase() == 'cancel') return message.channel.send('Cancelled!')
          else if (!/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/.test(collected2.first().content))
            return message.channel.send("Please provide a valid URL.");
          else {
            shell.exec(`python3 src/includes/add_repo.py "${collected.first().content.replace(/'/g, "\'").replace(/ /g, '-')}" "${collected2.first().content}"`);

            fs.writeFile(`/root/PackageFinderJS/repo_updaters/${collected.first().content}.py`, `import random\nimport os\nimport csv\nimport json\nimport shutil\nimport time\nimport bz2\nimport sys\nimport smtplib\nfrom subprocess import Popen\nimport re\nimport requests\nurl = '${collected2.first().content}'\ntry:\n    os.mkdir(f'{os.getcwd()}/repos')\n    os.mkdir(f'{os.getcwd()}/data')\nexcept:\n    pass\ntry:\n    headers={\n        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.47 Safari/537.36'\n    }\n    r = requests.get(f'{url}/Packages.bz2', headers=headers)\nexcept Exception as e:\n    print('Is this a repo?')\n    sys.exit(1)\nwith open(f'{os.getcwd()}/data/Packages.bz2', 'wb') as f:\n    f.write(r.content)\ntry:\n    zipfile = bz2.BZ2File('./data/Packages.bz2')\n    data = zipfile.read()\nexcept:\n    a = Popen(f'bzip2 -d ./data/Packages.bz2', shell=True)\n    while a is not None:\n            retcode = a.poll()\n            if retcode is not None:\n                print('Unzipped!')\n                data = open(f'{os.getcwd()}/data/Packages').read()\n                break\n    else:\n            time.sleep(1)\nfilepath = f'{os.getcwd()}//data/repo.csv'\nopen(filepath, 'wb').write(data)\nwith open(filepath, 'r+', errors='ignore') as lol:\n    try:\n        text = lol.read()\n    except Exception as e:\n        print(f'Error {e} occurred')\n    if re.search('/\ ', url):\n        text = re.sub('Filename: ./debs', f'Filename: {url}debs', text)\n        text = re.sub('Filename: ./deb', f'Filename: {url}deb', text)\n        text = re.sub('Filename: deb', f'Filename: {url}deb', text)\n        text = re.sub('Filename: debs', f'Filename: {url}debs', text)\n        text = re.sub('Filename: api', f'Filename: {url}api', text)\n        text = re.sub('Filename: pool', f'Filename: {url}pool', text)\n        text = re.sub('Filename: files', f'Filename: {url}files', text)\n    else:\n        text = re.sub('Filename: ./debs', f'Filename: {url}/debs', text)\n        text = re.sub('Filename: ./deb', f'Filename: {url}/deb', text)\n        text = re.sub('Filename: deb', f'Filename: {url}/deb', text)\n        text = re.sub('Filename: debs', f'Filename: {url}/debs', text)\n        text = re.sub('Filename: api', f'Filename: {url}/api', text)\n        text = re.sub('Filename: pool', f'Filename: {url}/pool', text)\n        text = re.sub('Filename: files', f'Filename: {url}/files', text)\n    lol.seek(0)\n    lol.write(text.replace('\0', ' '))\n    lol.truncate()\nfinal_data = {\n'url': f'{url}',\n'icon': f'{url}/CydiaIcon.png',\n'app': [],\n}\napp = {}\nwith open(f'{filepath}') as csvfile:\n    data = csv.reader(csvfile, delimiter=':')\n    for line in data:\n        if len(line) == 0:\n            final_data['app'].append(app)\n            app = {}\n            continue\n        try:\n            if line[1].strip() in ['http', 'https']:\n                line[1] = line[1] + ':' + line[2]\n        except:\n            pass\n        try:\n             app[line[0]] = line[1].strip()\n        except:\n             app[line[0]] = line[0].strip()\n      \njson_string = json.dumps(final_data)\nwith open('/root/PackageFinderJS/repos/${collected.first().content}', 'w') as f:\n    dat = json.dumps(final_data, indent=4)\n    f.write(dat)\n    f.close()`, () => { })
            await new Promise(r => setTimeout(r, 100));
            shell.exec(`git add repo_updaters && git commit -m "Added ${collected.first().content}" && git push --force`);

            // Load in new repo
            for (const file of fs.readdirSync("repos")) {
              const json = JSON.parse(fs.readFileSync(`repos/${file}`, "utf8"));
              json.name = file.replace(".json", "").replace(/-/g, ' ');
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
      shell.exec(`python3 src/includes/add_repo.py "${args[0].replace(/'/g, "\'")}" "${args[1]}"`);
      fs.writeFile(`./repo_updaters/${args[0].replace(/'/g, "\'")}.py`, `import random\nimport os\nimport csv\nimport json\nimport shutil\nimport time\nimport bz2\nimport sys\nimport smtplib\nfrom subprocess import Popen\nimport re\nimport requests\nurl = '${args[1]}'\ntry:\n    os.mkdir(f'{os.getcwd()}/repos')\n    os.mkdir(f'{os.getcwd()}/data')\nexcept:\n    pass\ntry:\n    headers={\n        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.47 Safari/537.36'\n    }\n    r = requests.get(f'{url}/Packages.bz2', headers=headers)\nexcept Exception as e:\n    print('Is this a repo?')\n    sys.exit(1)\nwith open(f'{os.getcwd()}/data/Packages.bz2', 'wb') as f:\n    f.write(r.content)\ntry:\n    zipfile = bz2.BZ2File('./data/Packages.bz2')\n    data = zipfile.read()\nexcept:\n    a = Popen(f'bzip2 -d ./data/Packages.bz2', shell=True)\n    while a is not None:\n            retcode = a.poll()\n            if retcode is not None:\n                print('Unzipped!')\n                data = open(f'{os.getcwd()}/data/Packages').read()\n                break\n    else:\n            time.sleep(1)\nfilepath = f'{os.getcwd()}//data/repo.csv'\nopen(filepath, 'wb').write(data)\nwith open(filepath, 'r+', errors='ignore') as lol:\n    try:\n        text = lol.read()\n    except Exception as e:\n        print(f'Error {e} occurred')\n    if re.search('/\ ', url):\n        text = re.sub('Filename: ./debs', f'Filename: {url}debs', text)\n        text = re.sub('Filename: ./deb', f'Filename: {url}deb', text)\n        text = re.sub('Filename: deb', f'Filename: {url}deb', text)\n        text = re.sub('Filename: debs', f'Filename: {url}debs', text)\n        text = re.sub('Filename: api', f'Filename: {url}api', text)\n        text = re.sub('Filename: pool', f'Filename: {url}pool', text)\n        text = re.sub('Filename: files', f'Filename: {url}files', text)\n    else:\n        text = re.sub('Filename: ./debs', f'Filename: {url}/debs', text)\n        text = re.sub('Filename: ./deb', f'Filename: {url}/deb', text)\n        text = re.sub('Filename: deb', f'Filename: {url}/deb', text)\n        text = re.sub('Filename: debs', f'Filename: {url}/debs', text)\n        text = re.sub('Filename: api', f'Filename: {url}/api', text)\n        text = re.sub('Filename: pool', f'Filename: {url}/pool', text)\n        text = re.sub('Filename: files', f'Filename: {url}/files', text)\n    lol.seek(0)\n    lol.write(text.replace('\0', ' '))\n    lol.truncate()\nfinal_data = {\n'url': f'{url}',\n'icon': f'{url}/CydiaIcon.png',\n'app': [],\n}\napp = {}\nwith open(f'{filepath}') as csvfile:\n    data = csv.reader(csvfile, delimiter=':')\n    for line in data:\n        if len(line) == 0:\n            final_data['app'].append(app)\n            app = {}\n            continue\n        try:\n            if line[1].strip() in ['http', 'https']:\n                line[1] = line[1] + ':' + line[2]\n        except:\n            pass\n        try:\n             app[line[0]] = line[1].strip()\n        except:\n             app[line[0]] = line[0].strip()\n      \njson_string = json.dumps(final_data)\nwith open('/root/PackageFinderJS/repos/${collected.first().content}', 'w') as f:\n    dat = json.dumps(final_data, indent=4)\n    f.write(dat)\n    f.close()`, () => { })
      await new Promise(r => setTimeout(r, 100));
      shell.exec(`git add repo_updaters && git commit -m "Added ${args[0]}" && git push --force`);

      // Load in new repo
      for (const file of fs.readdirSync("repos")) {
        const json = JSON.parse(fs.readFileSync(`repos/${file}`, "utf8"));
        json.name = file.replace(".json", "").replace(/-/g, ' ');
        console.log(`Reloaded ${json.name}`);
        client.jsons.set(file, json);
      }
      message.channel.send(`Added repo: \`${args[0]}\``);
    }
  }
}

