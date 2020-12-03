const Discord = require("discord.js");
const rm = require("discord.js-reaction-menu");
const ms = require('ms')
const { blacklist } = require("../config.json")

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
        message.channel
          .send(
            `I require the \`${command.botPermissions.join(
              "`, `"
            )}\` permission(s) to execute this command.`
          )
          .then(m =>
            m.delete({
              timeout: 10000
            })
          );
        return;
      }

      try {
        command
          .execute(client, message, args)
          .then(
            console.log(
              `[${command.name.charAt(0).toUpperCase() +
              command.name.slice(1)}] Command has been run in ${message.guild.name
              }`
            )
          );
      } catch { }
    }
  }

 //if (blacklist.includes(message.author.id)) return message.channel.send("<a:flushSpin:783892030924783616> You are blacklisted <a:flushSpin:783892030924783616>")

  const matches = message.content.match(/\[\[([^\]\]]+)\]\]/);
  if (!matches) return;

  const now = Date.now();
  const expiration = client.cooldowns.get(message.author.id)
  if (expiration) {
    if (expiration > now) return message.reply(
      `Please wait ${ms(expiration - now)} before searching again.`,
      { allowedMentions: { repliedUser: false } }
    )
      .then(msg => {
        msg.delete({ timeout: 5000 })
      });
  }
  
  const package = matches[1].toLowerCase();
  if (package == 'cydown') return message.channel.send("Sorry, I don't provide info for pirate tweaks.")
  let sent = false;

  const foundPackages = [];
  const finalEmbeds = [];

  try {
    client.jsons.forEach(repo => {
      for (index in repo.app) {
        if (
          (repo.app[index].Name
            ? repo.app[index].Name.toLowerCase()
            : ""
          ).startsWith(package) ||
          package ===
          (repo.app[index].Package
            ? repo.app[index].Package.toLowerCase()
            : "")
        ) {
          const lmao = new Discord.MessageEmbed()
            .setColor("#61b6f2")
            .setDescription(repo.app[index].Description)
            .setTimestamp()
            .setThumbnail(repo.app[index].Icon ? repo.app[index].Icon : "")
            .setFooter(`${repo.name}`, repo.icon)
            .setAuthor(
              repo.app[index].Name
                ? repo.app[index].Name.trim()
                : repo.app[index].Package.trim()
            );
          if (repo.app[index].Maintainer.includes("Hayden Seay")) {
            lmao.addFields({
              name: "Author",
              value: repo.app[index].Maintainer.replace(/ <(.*?)>/g, ""),
              inline: true
            });
          } else {
            lmao.addFields({
              name: "Author",
              value: repo.app[index].Author
                ? repo.app[index].Author.replace(/ <(.*?)>/g, "")
                : repo.app[index].Author,
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
          if (!foundPackages.includes(repo.app[index].Package)) {
            finalEmbeds.push(lmao);
          }
          foundPackages.push(repo.app[index].Package);
        }
      }
    });
  } catch (err) {
    return message.reply(
      "I couldn't find anything matching that search query!",
      { allowedMentions: { repliedUser: false } }
    )
      .then(msg => {
        msg.delete({ timeout: 5000 })
      });
    
  }
  if (!sent)
    return message.reply(
      "I couldn't find anything matching that search query!",
      { allowedMentions: { repliedUser: false } }
    )
      .then(msg => {
        msg.delete({ timeout: 5000 })
      });
  
  client.cooldowns.set(message.author.id, now + 2500)
  
  new rm.menu({
    channel: message.channel,
    message: message,
    userID: message.author.id,
    pages: finalEmbeds
  });

}

