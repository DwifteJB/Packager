module.exports = async client => {
  try {
    console.log(
      `Logged in as ${client.user.tag}\nIn ${client.guilds.cache.size} servers`
    );
                    
    setInterval(() => {
      client.emit('addRepo', '')
    }, 60000 * 60)

    await (await client.users.fetch("521762564062052393")).send("I am ready");
  } catch { }
};

