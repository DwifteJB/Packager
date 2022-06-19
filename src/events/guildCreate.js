const Discord = require("discord.js");

module.exports = async (client, guild) => {
  const lmao = new Discord.MessageEmbed()
    .setColor("#17bcb8")
    .setTitle("Packager is here!")
    .setDescription(
      "Thanks for inviting packager! The bot may not respond instantly as it might be updating the repos stored locally!\nYou can find packages by typing: [[TWEAK]]!"
    )
    .setTimestamp();
  try {
    guild.channels.cache.find(c => c.type === "text" && c.permissionsFor(guild.me).has("SEND_MESSAGES")).send(lmao)
  } catch(e){}
};

