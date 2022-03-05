const Discord = require("discord.js");

module.exports = {
  name: "about",
  description: "View some bot info",
  type: "utility",
  async execute(client, message, args) {
    const inviteEmbed = new Discord.MessageEmbed()
      .setTitle("Packager")
      .setColor("#61b6f2")
      .setThumbnail(
        "https://cdn.discordapp.com/avatars/779761768447737886/d77f492e2138703d571323fad9b5f194.webp?size=2048"
      )
      .setDescription(
        `Packager allows for jailbreak tweak searches within Discord!`
      )
      .addField(
        "Invite",
        "The invite link can be found [here](https://discord.com/oauth2/authorize?client_id=779761768447737886&scope=bot&permissions=19456) to add it to your server."
      )
      .addField(
        "Usages",
        `\`\`\`diff\n+ [[Sileo]]\n+ [[org.coolstar.sileo]]\n+ Hey guys check out [[Sileo]]!\`\`\``
      )
      .setFooter(
        `Made by ToastOnAStick and DwifteJB`,
        `https://cdn.discordapp.com/avatars/779761768447737886/d77f492e2138703d571323fad9b5f194.webp?size=256`
      );

    message.channel.send({embeds: [inviteEmbed]});
  }
};

