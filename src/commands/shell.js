const { owners } = require("../config.json");
const haste = require("hastebin-gen");
const { spawn } = require('child_process')

module.exports = {
  name: "shell",
  type: "private",
  async execute(client, message, args) {
    if (!owners.includes(message.author.id)) return;
    if (!args[0]) {
      return message.channel.send(`Please use the following syntax:\n\n\`\`\`${client.prefix}shell <command>\`\`\``)
    }
    message.channel.send(`Running \`${args.join(" ")}\``);
    const cp = spawn(`${args[0]}`, args.slice(1), {
      detached: true
    });
    let output = ''
    cp.on('error', (err) => {
      return message.channel.send(`Failed to execute command. Error: \`\`\`${err}\`\`\``);
    });
    cp.stdout.on('data', (data) => {
      output += `${data}\n`
    })
    cp.on('close', (code) => {
      if (output.length < 1) return message.channel.send('Finished with no output.')
      if (output.length > 1994) {
        haste(output).then(haste => message.channel.send("Output was too big: " + haste))
      }
      else message.channel.send(`\`\`\`${output}\`\`\``);
    });
  }
};

