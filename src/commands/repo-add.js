const {SlashCommandBuilder,ModalBuilder,ActionRowBuilder,TextInputBuilder,TextInputStyle} = require("discord.js")
const { owners } = require("../config.json");
const fs = require("fs");
const path = require("path");
module.exports = {
  Data: new SlashCommandBuilder()
    .setName("addrepo")
    .setDescription("Adds a repo to packager."),
  async execute(client, interaction) { 
    const fields = {
        Name: new TextInputBuilder()
        .setCustomId('Name')
        .setLabel("Repository Name")
        .setRequired(true)
        .setStyle(TextInputStyle.Short),
        Link: new TextInputBuilder()
        .setCustomId('Link')
        .setLabel("Repository URL")
        .setRequired(true)
        .setStyle(TextInputStyle.Short),
    }
    const modal = new ModalBuilder()
        .setCustomId('myModal')
        .setTitle('Add a new repo')
        .setComponents(
          new ActionRowBuilder().setComponents(fields.Name),
          new ActionRowBuilder().setComponents(fields.Link)
        );



    await interaction.showModal(modal);
    const submitted = await interaction.awaitModalSubmit({
      time: 60000,
      filter: i => i.user.id === interaction.user.id,
    }).catch(async error => {
      await submitted.reply("You took too long...")
      return null
    })
    if (submitted) {
      let Name = submitted.fields.fields.get("Name").value
      let Link = submitted.fields.fields.get("Link").value
      console.log(Name,Link)
      if (
        !/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/.test(
          Link
        )
      ) 
        return submitted.reply({content:"You didn't provide a valid URL!",ephemeral: true,fetchReply: true})

      const JSONFile = JSON.parse(fs.readFileSync(path.join(global.rootFolder,"src")+"\\repos.json"))
      JSONFile[Name]=Link
      fs.writeFileSync(path.join(global.rootFolder,"src")+"\\repos.json",JSON.stringify(JSONFile,null,4))
      client.emit('addRepo', '')
      submitted.reply({content:`Successfully added the ${Name} repository!`,ephemeral:true,fetchReply:true})



    }
  }
};

