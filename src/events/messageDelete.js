const { spawn } = require('child_process')
const { Collection } = require('discord.js')

module.exports = async (client, message) => {
    const mID = client.saves.get(message.id)
    if (mID) {
        try {
            const sent = await message.channel.messages.fetch(mID)
            sent.delete().catch(() => { })
        } catch (e) { }
    }
}

