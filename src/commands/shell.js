const { owners } = require("../config.json");
const haste = require("hastebin-gen");
const { spawn, exec } = require("child_process");
const {SlashCommandBuilder} = require("discord.js")
module.exports = {
  Data: new SlashCommandBuilder()
    .setName("shell")
    .setDescription("Runs a shell command")
    .addStringOption(option =>
      option
      .setRequired(true)
      .setName("code")
      .setDescription("Code to run")),
  async execute(client, message) {
    if (!owners.includes(message.user.id)) return;
    const Command = message.options.getString("code")
    message.reply(`Running \`${Command}\``);
    exec(Command, (error, output, stderr) => {
      if (error) {
        return message.reply(
          `Failed to execute command. Error: \`\`\`${error}\`\`\``
        );
      }
      if (output.length < 1)
        return message.reply("Finished with no output.");
      if (output.length > 1994) {
        haste(output).then(haste =>
          message.reply("Output was too big: " + haste)
        );
      } else message.reply(`\`\`\`${output}\`\`\``);
    });
  }
};

