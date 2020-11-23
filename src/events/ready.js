module.exports = async (client) => {
    console.log(`Logged in as ${client.user.tag}\nIn ${client.guilds.cache.size} servers`);
}