const { owners } = require("../config.json");
const haste = require("hastebin-gen");
const { exec } = require('child_process');
const shell = require("shelljs");
const fs = require('fs');

module.exports = {
    name: "rmrepo",
    type: "private",
    async execute(client, message, args) {
        if (!owners.includes(message.author.id)) return;
        if (!args[0]) {
            return message.channel.send(`Please use the following syntax:\n\n\`\`\`${client.prefix}rmrepo <Name>\`\`\``)
        }
    
        exec(`rm -rf repo_updaters/${args[0].replace(/'/g, "\'")}.py`)
        shell.exec(`git add repo_updaters && git commit -m "Removed ${args[0]}" && git push --force`);

        // Load in new repo
        delete require.cache[require.resolve(`repos/${args[0].replace(/'/g, "\'")}.json`)];
        exec(`rm -rf repos/${args[0].replace(/'/g, "\'")}.json`)
        for (const file of fs.readdirSync("repos")) {
            const json = JSON.parse(fs.readFileSync(`repos/${file}`, "utf8"));
            json.name = file.replace(".json", "").replace(/-/g, ' ').replace(/\'/g, "'");
            console.log(`Reloaded ${json.name}`);
            client.jsons.set(file, json);
        }
        client.packageCount = 0
        client.jsons.forEach(repo => {
            client.packageCount += repo.app.length
        })
        client.user.setActivity(`${client.packageCount} packages`, { type: 'WATCHING' })
        message.channel.send(`Removed repo: \`${args[0]}\``);
    }
}

