const {EmbedBuilder,SelectMenuBuilder,ActionRowBuilder,ComponentType} = require("discord.js");
const ms = require('ms')

const rm = require('discord.js-reaction-menu')
const shitTweaks = ['batchomatic', 'noclutter'];
const { blacklist } = require("../config.json") 

module.exports = async (client, message) => {

  /* Switching to Slash Commands-Only */
  
  // if (message.content.startsWith(client.prefix)) {
  //   const args = message.content
  //     .slice(client.prefix.length)
  //     .trim()
  //     .split(/ +/);
  //   const commandName = args.shift().toLowerCase();
  //   const command =
  //     client.commands.get(commandName) ||
  //     client.commands.find(
  //       cmd => cmd.aliases && cmd.aliases.includes(commandName)
  //     );
  //   if (command) {
  //     if (command.disabled == true) return;

  //     try {
  //       await command
  //         .execute(client, message, args)
  //         .then(
  //           console.log(
  //             `[${command.name.charAt(0).toUpperCase() +
  //             command.name.slice(1)}] Command has been run in ${message.guild.name
  //             }`
  //           )
  //         );
  //     } catch(e) {
  //       console.error(e)
  //     }
  //   }
  // }

 

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
  const Embeds = [];

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
          const lmao = new EmbedBuilder()
            .setColor("#61b6f2")
            .setDescription(Data.Description.replace(/\|\|/g, ''))
            .setTimestamp()
            .setThumbnail(Data.Icon ? Data.Icon : "")
            .setFooter({text: repo.name, iconURL: repo.icon || null})
            .setAuthor({name: Data.Name
              ? Data.Name.trim()
              : Data.Package.trim()});
            
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
            Embeds.push(lmao);
          }
          foundPackages.push(Data.Package);
        }
      }
    });
  } catch (err) {
    console.log(err);
    return message.reply(
      "Error occured, report was sent to Dwifte.",
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
      .setCustomId('_select')
      .setPlaceholder(Embeds[0].data.author.name)
  );
  for (index in Embeds) {
    row.components[0].addOptions({
      label: Embeds[index].data.author.name,
      description: `${Embeds[index].data.fields[0].value} 🞄 ${Embeds[index].data.footer.text}`,
      value: index
    })
  }
  const EmbedMSG = await message.reply({embeds:[Embeds[0]],components:[row]})
  const filter = i => {
    i.deferUpdate();

    return i.user.id === message.author.id;
  };

  const collector = EmbedMSG.createMessageComponentCollector({ filter, componentType: ComponentType.StringSelect, time: 60000 })
  collector.on("collect", interaction => {
      row.components[0].setPlaceholder(Embeds[interaction.values[0]].data.author.name || "Not Found!")
      EmbedMSG.edit({components: [row], embeds: [Embeds[interaction.values[0]]] })
  });
  collector.on("end", c => {
    EmbedMSG.edit({components: []})
  })
  
}