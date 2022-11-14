const {MessageEmbed} = require("discord.js");
const ms = require('ms')

const rm = require('discord.js-reaction-menu')
const shitTweaks = ['batchomatic', 'noclutter'];
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
      if (!message.guild.me.permissions.has(command.botPermissions)) {
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
        await command
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

 

  const matches = message.content.match(/\[\[([^\]\]]+)\]\]/);
  if (!matches) return;
  if (blacklist.includes(message.author.id)) return message.channel.send("Yeah, you're uh. blacklisted.")
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
  if (shitTweaks.includes(package)) return message.channel.send("I would rather you not try to break your device.")
  let sent = false;

  const foundPackages = [];
  const finalEmbeds = [];

  try {
    client.jsons.forEach(repo => {
      console.log(package)

      for (index in repo.app) {
        let Data = repo.app[index]
        if (
          (Data.Name
            ? Data.Name.toLowerCase()
            : ""
          ).startsWith(package) ||
          package ===
          (Data.Package
            ? Data.Package.toLowerCase()
            : "")
        ) {
          Data.Icon = (!Data.Icon) ? "https://upload.wikimedia.org/wikipedia/commons/f/fb/Icon_Sileo.png" : Data.Icon
          Data.Description = (!Data.Description) ? "No description was specified for this package :(" : Data.Description
          const lmao = new MessageEmbed()
            .setColor("#61b6f2")
            .setDescription(Data.Description.replace(/\|\|/g, ''))
            .setTimestamp()
            .setThumbnail(Data.Icon ? Data.Icon : "")
            .setFooter(`${repo.name}`, repo.icon)
            .setAuthor(
              Data.Name
                ? Data.Name.trim()
                : Data.Package.trim()
            );
            
          if (Data.Maintainer.includes("Hayden Seay")) {
            lmao.addFields({
              name: "Author",
              value: Data.Maintainer.replace(/ <(.*?)>/g, ""),
              inline: true
            });
          } else {
            lmao.addFields({
              name: "Author",
              value: Data.Author
                ? Data.Author.replace(/ <(.*?)>/g, "")
                : Data.Author,
              inline: true
            });
          }
          lmao.addFields(
            { name: "Version", value: Data.Version, inline: true },
            {
              name: "Repo",
              value: `[${repo.name}](http://dwifte.eu.org/repo.php?repo=${repo.url})`,
              inline: true
            },
            {
              name: "Bundle ID",
              value: Data.Package
            },
            {
              name: "More info",
              value: `[Open in Sileo](http://dwifte.eu.org/open.php?package=${Data.Package})`
            }
          );
          sent = true;
          if (!foundPackages.includes(Data.Package)) {
            finalEmbeds.push(lmao);
          }
          foundPackages.push(Data.Package);
        }
      }
    });
  } catch (err) {
    console.log(err);
    return message.reply(
      "I got an error!",
      { allowedMentions: { repliedUser: false } }
    )
      .then(msg => {
        setTimeout(() => msg.delete(), 5000)
      });
    
  }
  if (!sent) {
    return message.reply(
      "I couldn't find anything matching that search query!",
      { allowedMentions: { repliedUser: false } }
    )
      .then(msg => {
        setTimeout(() => msg.delete(), 5000)
      });
  }

  
  client.cooldowns.set(message.author.id, now + 2500)
  const row = new ActionRowBuilder()
  .addComponents(
    new SelectMenuBuilder()
      .setCustomId('select')
      .setPlaceholder(Embeds[0].data.title)
  );

  
}