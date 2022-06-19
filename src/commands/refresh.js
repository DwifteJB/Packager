const fs = require('fs');
const { owners } = require("../config.json");
const shell = require('shelljs')
const {RepoUpdater} = import("./../includes/repoUpdate.js");
module.exports = {
    name: "refresh",
    description: "Refreshes packages/repos",
    type: "private",
    async execute(client, message, args) {
        if (!owners.includes(message.author.id)) return;
        const msg = await message.channel.send('**Refreshing Packages & Repos...**')
        const repos = JSON.parse(fs.readFileSync("./src/repos.json"))
        for (var repo in repos) {
          console.log("Updating repo: " + repo)
          await RepoUpdater(repo,repos[repo]);
        }
        client.emit('addRepo', '')
        msg.edit("**Packages Refreshed!**")
    }
}

