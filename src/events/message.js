const Discord = require("discord.js");
const shitTweaks = ["noclutter","batchomatic"]

module.exports = async (client, message) => {
    if (message.content.startsWith(client.prefix)) {
        const args = message.content
            .slice(client.prefix.length)
            .trim()
            .split(/ +/);
        const commandName = args.shift().toLowerCase();
        const command =
            client.commands.get(commandName) ||
            client.commands.find(
                cmd => cmd.aliases && cmd.aliases.includes(commandName)
            );
        if (command) {

            if (command.disabled == true) return;
            if (!message.guild.me.hasPermission(command.botPermissions)) {
                message.channel.send(`I require the \`${command.botPermissions.join('`, `')}\` permission(s) to execute this command.`).then(m => m.delete({
                    timeout: 10000
                }));
                return;
            }

            try {
                command
                    .execute(client, message, args)
                    .then(
                        console.log(
                            `[${command.name.charAt(0).toUpperCase() +
                            command.name.slice(1)}] Command has been run in ${message.guild.name}`
                        )
                    );
            } catch { }
        }
    }
    
    const matches = message.content.match(/\[\[([^\]\]]+)\]\]/);
    if (!matches) return;
    const package = matches[1].toLowerCase();
    let sent = false;
    let number = 0;
    let prev = 0;
    let bundle = "None";
    if (shitTweaks.includes(package)) return message.reply("Sorry, but I don't provide info for shit tweaks!", { allowedMentions: { replied_user: false } });
    client.jsons.forEach(repo => {
        for (index in repo.app) {
            if (package === (repo.app[index].Name ? repo.app[index].Name.toLowerCase() : '') ||
                package === (repo.app[index].Package ? repo.app[index].Package.toLowerCase() : '')) {
                if(bundle === repo.app[index].Package) { return; }
                prev = number;
	        number = prev+1;
                console.log(`Found ${number} packages!`);
            }
	}
        for (index in repo.app) {
            if (package === (repo.app[index].Name ? repo.app[index].Name.toLowerCase() : '') ||
                package === (repo.app[index].Package ? repo.app[index].Package.toLowerCase() : '')) {
                const lmao = new Discord.MessageEmbed()
                    .setColor("#61b6f2")
                    .setDescription(repo.app[index].Description)
                    .setTimestamp()
                    .setFooter(repo.name, repo.icon)
                    .setAuthor(repo.app[index].Name ? repo.app[index].Name.trim() : repo.app[index].Package.trim());
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
                sent = true;
                return message.reply("", { embed: lmao.setThumbnail(repo.app[index].Icon), allowedMentions: { replied_user: false } }).catch(() => {
                    message.reply("", { embed: lmao.setThumbnail(`https://i.imgur.com/p9NJCoU.png`), allowedMentions: { replied_user: false } });
                })
            }
            if (sent) return;
        }
        if (sent) return;
    });
    if (!sent) message.reply("I couldn't find anything matching that search query!", { allowedMentions: { replied_user: false } });
}
