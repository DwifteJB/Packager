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
const Packix = JSON.parse(fs.readFileSync(`./repos/Packix.json`, 'utf8'));
const Procursus = JSON.parse(fs.readFileSync(`./repos/Procursus.json`, 'utf8'));
const Dynastic = JSON.parse(fs.readFileSync(`./repos/Dynastic.json`, 'utf8'));

client.on('ready', () => {
console.log(`Logged in as ${client.user.tag}\nIn ${client.guilds.cache.size} servers`);
    client.user.setStatus('online')
    client.user.setPresence({
        game: {
            name: 'with Packages',
            type: "PLAYING"
        }
    });
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
        const matches = message.content.match(/\[\[([^\]\]]+)\]\]/);
        if (!matches) return;
        const package = matches[1];
        for (index in BigBoss.app) {
          if(package === BigBoss.app[index].Name) {

             const lmao = new Discord.MessageEmbed()
	             .setColor('#17bcb8')
	             .setDescription(BigBoss.app[index].Description)
	             .setTitle(`${BigBoss.app[index].Name.trim()}`)
   	             .setTimestamp()
	             .setFooter('BigBoss', 'https://pbs.twimg.com/profile_images/756727140779831297/-qWaC-UR_400x400.jpg')
 	             .addFields(

	        	{ name: 'Author', value: BigBoss.app[index].Author, inline: true },
	        	{ name: 'Version', value: BigBoss.app[index].Version, inline: true },

                        { name: 'Repo', value: `[BigBoss](http://dwifte.eu.org/repo.php?repo=http://apt.thebigboss.org/repofiles/cydia/dists/stable)`, inline: true },
	        	{ name: 'More info', value: `[Open in Sileo](http://dwifte.eu.org/open.php?package=${BigBoss.app[index].Package})`, inline: true },

                	);

              try {
                message.channel.send(lmao.setThumbnail(BigBoss.app[index].Icon));
              } catch (error) {
                message.channel.send(lmao.setThumbnail(`https://i.imgur.com/p9NJCoU.png`));

                console.log(error);

              }
              return;
          }
        }

       for (index in Packix.app) {
          if(package === Packix.app[index].Name) {

             const lmao = new Discord.MessageEmbed()
	             .setColor('#17bcb8')
	             .setDescription(Packix.app[index].Description)
	             .setTitle(`${Packix.app[index].Name.trim()}`)
   	             .setTimestamp()
	             .setFooter('Packix', 'https://pbs.twimg.com/profile_images/1046836237192040449/54RYzohk_400x400.jpg')
 	             .addFields(
	        	{ name: 'Author', value: Packix.app[index].Author, inline: true },
	        	{ name: 'Version', value: Packix.app[index].Version, inline: true },
                        { name: 'Repo', value: `[Packix](http://dwifte.eu.org/repo.php?repo=https://repo.packix.com)`, inline: true },
	        	{ name: 'More info', value: `[Open in Sileo](http://dwifte.eu.org/open.php?package=${Packix.app[index].Package})`, inline: true },
                	);

               try {
                message.channel.send(lmao.setThumbnail(Packix.app[index].Icon));
              } catch (error) {
                message.channel.send(lmao.setThumbnail());

                console.log(error);

              }
              return;
          }
        }
       for (index in Procursus.app) {
          if(package === Procursus.app[index].Name) {

             const lmao = new Discord.MessageEmbed()
	             .setDescription(Procursus.app[index].Description)
	             .setColor('#17bcb8')
	             .setTitle(`${Procursus.app[index].Name.trim()}`)
   	             .setTimestamp()

	             .setFooter('Procursus', 'https://apt.procurs.us/CydiaIcon.png')
 	             .addFields(

	        	{ name: 'Author', value: "Hayden Seay", inline: true },
	        	{ name: 'Version', value: Procursus.app[index].Version, inline: true },
                        { name: 'Repo', value: `[Procursus](http://dwifte.eu.org/repo.php?repo=https://apt.procurs.us)`, inline: true },
	        	{ name: 'More info', value: `[Open in Sileo](http://dwifte.eu.org/open.php?package=${Procursus.app[index].Package})`, inline: true },
                	);

              try {
                message.channel.send(lmao.setThumbnail(Procursus.app[index].Icon));
              } catch (error) {
                message.channel.send(lmao.setThumbnail(`https://i.imgur.com/p9NJCoU.png`));
                console.log(error);
              }

              return;
          }
        }

       for (index in Procursus.app) {
          if(package === Dysnastic.app[index].Name) {

             const lmao = new Discord.MessageEmbed()
	             .setDescription(Dynastic.app[index].Description)
	             .setColor('#17bcb8')
	             .setTitle(`${Dynastic.app[index].Name.trim()}`)
   	             .setTimestamp()

	             .setFooter('Dynastic', 'https://repo.dynastic.co/CydiaIcon.png')
 	             .addFields(

	        	{ name: 'Author', value: "${Dynastic.app[index].Author()}", inline: true },
	        	{ name: 'Version', value: Dynastic.app[index].Version, inline: true },
                        { name: 'Repo', value: `[Procursus](http://dwifte.eu.org/repo.php?repo=https://repo.dynastic.co)`, inline: true },
	        	{ name: 'More info', value: `[Dynastic](http://dwifte.eu.org/open.php?package=${Dynastic.app[index].Package})`, inline: true },
                	);

              try {
                message.channel.send(lmao.setThumbnail(Dynastic.app[index].Icon));
              } catch (error) {
                message.channel.send(lmao.setThumbnail(`https://i.imgur.com/p9NJCoU.png`));
                console.log(error);
              }

              return;
          }
        }

	message.channel.send("Sorry, we couldn't find that package.");
});

client.login(token);
