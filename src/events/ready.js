const { spawn } = require('child_process')

module.exports = async client => {
  console.log(
    `Logged in as ${client.user.tag}\nIn ${client.guilds.cache.size} servers`
  );
  client.user.setActivity(`${client.packageCount} packages`, {
    type: "WATCHING"
  });
  (await client.users.fetch("320546614857170945")).send("I am ready");
};

