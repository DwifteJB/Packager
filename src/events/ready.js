module.exports = async client => {
  try {
    console.log(
      `Logged in as ${client.user.tag}\nIn ${client.guilds.cache.size} servers`
    );

    await (await client.users.fetch("521762564062052393")).send("I am ready");
  } catch { }
};

