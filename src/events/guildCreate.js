module.exports = async (client, guild) => {
    let channelID;
    let channels = guild.channels.cache;

    channelLoop: for (let key in channels) {
        let c = channels[key];
        if (c[1].type === "text") {
            channelID = c[0];
            break channelLoop;
        }
    }

    let channel = guild.channels.cache.get(guild.systemChannelID || channelID);

    const lmao = new Discord.MessageEmbed()
        .setColor("#17bcb8")
        .setTitle("Packager is here!")
        .setDescription(
            "Thanks for inviting packager! The bot may not respond instantly as it might be updating the repos stored locally!\nYou can find packages by typing: [[TWEAK]]!"
        )
        .setTimestamp();
    channel.send(lmao);
}