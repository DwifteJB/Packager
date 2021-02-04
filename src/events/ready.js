const { spawn } = require('child_process')
const { Collection } = require('discord.js')

module.exports = async client => {
  try {
    console.log(
      `Logged in as ${client.user.tag}\nIn ${client.guilds.cache.size} servers`
    );
    client.user.setActivity(`${client.packageCount.toLocaleString()} packages`, {
      type: "WATCHING"
    });
    await (await client.users.fetch("320546614857170945")).send("I am ready");
  } catch { }
};

