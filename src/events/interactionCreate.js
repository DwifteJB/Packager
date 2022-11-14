const Discord = require("discord.js");
class InteractionHandler {
    constructor(client,interaction) {
        this.client = client
        this.interaction = interaction
        this.command = this.client.commands.get(this.interaction.commandName)
        this.channel = this.interaction.guild.channels.cache.get(interaction.channelId)
    }
    async checkPermissions() {
        if (!this.command) return false;
        if (this.command.permissions) {
            this.message.permissions = await this.channel.permissionsFor(this.message.author);
            if (!authorPerms || !authorPerms.has(this.command.permissions)) {
                return false;
            }
            return true;
        }
        return true;
    }
}

module.exports = async (client, interaction) => {
    if (!interaction.isChatInputCommand()) return;
    let IHandle = new InteractionHandler(client,interaction)
    if (IHandle.command) {
        if (IHandle.checkPermissions() != false) {
            await IHandle.command.execute(client,interaction);
        } else {
            interaction.reply("You don't have enough permissions <:3dsadsmiley:1012402373550932108>")
        }
    }
  
}

