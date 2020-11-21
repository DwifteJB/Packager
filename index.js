
// Modules
const Discord = require('discord.js');
// create a new Discord client
const client = new Discord.Client();

const {
	token
} = require('./config.json');

client.once('ready', () => {
	console.log(`Logged in as ${client.user.tag}\nIn ${client.guilds.cache.size} servers`);
});


client.on('message', async message => {
        const prefix = "[[";
        const end = "]]";
	const args = message.content.slice(prefix.length).trim().split(/ +/).slice(end.length);
	const command = args.shift().toLowerCase();

	if (!message.content.startsWith(prefix) || message.author.bot) return;
	if (command === 'test') {
            message.channel.send("uwu");
        }
});

client.login(token);
