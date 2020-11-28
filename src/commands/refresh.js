const fs = require('fs');
const { owners } = require("../config.json");
const shell = require('shelljs')

module.exports = {
    name: "update",
    description: "Update Siri using git.",
    type: "private",
    async execute(client, message, args) {
        if (!owners.includes(message.author.id)) return;
        fs.readdirSync("repo_updaters").forEach(file => {
            shell.exec(`python3 "./repo_updaters/${file}"`);
        });
        client.emit('addRepo', '')
        message.channel.send("**Packages Refreshed!**")
    }
}

