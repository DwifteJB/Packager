const Discord = require("discord.js");
const rm = require("discord.js-reaction-menu");
const ms = require('ms')

module.exports = async (client, oldMessage, newMessage) => {
  client.emit('message', newMessage)
}

