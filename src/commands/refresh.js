const fs = require('fs');
const { owners } = require("../config.json");
const shell = require('shelljs')

module.exports = {
    name: "refresh",
    description: "Refreshes packages/repos",
    type: "private",
    async execute(client, message, args) {
        if (!owners.includes(message.author.id)) return;
        const msg = await message.channel.send('**Refreshing Packages & Repos...**')
        fs.readdirSync("repo_updaters").forEach(file => {
            shell.exec(`python3 "./repo_updaters/${file}"`);
        });
        client.emit('addRepo', '')
        msg.edit("**Packages Refreshed!**")
    }
}

