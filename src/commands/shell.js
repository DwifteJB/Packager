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
    const msg = await message.reply({content: `Running \`${Command}\``, fetchReply: true});
    exec(Command, (error, output, stderr) => {
      if (error) {
        return msg.edit(
          `Failed to execute command. Error: \`\`\`${error}\`\`\``
        );
      }
      if (output.length < 1)
        return msg.edit("Finished with no output.");
      if (output.length > 1994) {
        haste(output).then(haste =>
          msg.edit("Output was too big: " + haste)
        );
      } else msg.edit(`\`\`\`${output}\`\`\``);
    });
  }
};

