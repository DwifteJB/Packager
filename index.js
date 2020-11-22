// Modules
const Discord = require('discord.js');
const fs = require('fs');
const shell = require('shelljs')

const client = new Discord.Client();

const { token } = require('./config.json');

console.log('Updating repos...')

fs.readdirSync('./repo_updaters').forEach(file => {
  shell.exec(`python3 ./repo_updaters/${file}`)

});
console.log('Reading jsons...');
const BigBoss = JSON.parse(fs.readFileSync(`./repos/BigBoss.json`, 'utf8'));
const packix = JSON.parse(fs.readFileSync(`./repos/Packix.json`, 'utf8'));

client.once('ready', () => {
	console.log(`Logged in as ${client.user.tag}\nIn ${client.guilds.cache.size} servers`);
});

client.on("guildCreate", guild => {
    let channelID;
    let channels = guild.channels.cache;

    channelLoop:
    for (let key in channels) {
        let c = channels[key];
        if (c[1].type === "text") {
            channelID = c[0];
            break channelLoop;
        }
    }

    let channel = guild.channels.cache.get(guild.systemChannelID || channelID);

    const lmao = new Discord.MessageEmbed()
	    .setColor('#17bcb8')
	    .setTitle('Packager is here!')
	    .setDescription('Thanks for inviting packager! The bot may not respond instantly as it might be updating the repos stored locally!\nYou can find packages by typing: [[TWEAK]]!')
   	    .setTimestamp();
    channel.send(lmao);
});

client.on('message', async message => {
        const prefix = "[[";
	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const command = args.shift().slice(']]'.length).toLowerCase();
	if (!message.content.startsWith(prefix) || message.author.bot) return;
        message.channel.send(`Info:\nCommand: ${command}\nArgs: {args}`);
        for (index in BigBoss.app) {
          console.log(BigBoss.app[index].Name)
        }
	if (command === 'test') {
            message.channel.send("uwu");
        }
});

client.login(token);
