const Discord = require("discord.js");

module.exports = {
  name: "invite",
  description: "Invite me to your server",
  type: 'utility',
  async execute(client, message, args) {
    let inviteEmbed = new Discord.MessageEmbed()
      .setTitle('Invite')
      .setColor('#61b6f2')
      .setThumbnail('https://cdn.discordapp.com/avatars/779761768447737886/d77f492e2138703d571323fad9b5f194.webp?size=2048')
      .setDescription(`[Click here to invite me](https://discord.com/oauth2/authorize?client_id=779761768447737886&scope=bot&permissions=19456)`)
      message.channel.send(inviteEmbed);
  }
}
