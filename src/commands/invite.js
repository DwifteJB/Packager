const Discord = require("discord.js");

module.exports = {
  name: "invite",
  description: "Invite me to your server",
  type: 'utility',
  async execute(client, message, args) {
    //console.log("[Siri : Invite] Command has been run.");
    let inviteEmbed = new Discord.MessageEmbed()
      .setTitle('Invite')
      .setColor('#18bc9b')
      .setDescription(`[Click here to invite me](https://discord.com/oauth2/authorize?client_id=779761768447737886&scope=bot&permissions=19456)`)
      message.channel.send(inviteEmbed);
  }
}
