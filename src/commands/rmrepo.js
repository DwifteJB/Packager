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
    
        exec(`rm -rf repo_updaters/${args[0]}.json`)
        shell.exec(`git add repo_updaters && git commit -m "Added ${args[0]}" && git push --force`);

        // Load in new repo
        exec(`rm -rf repos/*`)
        for (const file of fs.readdirSync("repos")) {
            const json = JSON.parse(fs.readFileSync(`repos/${file}`, "utf8"));
            json.name = file.replace(".json", "").replace(/-/g, ' ');
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

