const Discord = require("discord.js");
const { owners } = require("../config.json");
const { exec, spawn } = require("child_process");

module.exports = {
  name: "eval",
  aliases: ['evaluate'],
  description: "Evaluates JS code",
  type: "private",
  async execute(client, message, args) {
    //console.log("[Siri : Eval] Command has been run.");
    let embede;
    let result;
    let argss;
    let msg = message;
    let col;
    let timeTook;
    const { inspect } = require("util");

    if (!owners.includes(message.author.id)) return;

    

    let start = new Date();
    argss = args.slice(0).join(" ");
    if(!argss) return message.channel.send('Please provide some code.')
    col = "GREEN";

    try {
           result = inspect(await eval(`( async () => {
      return (${argss})
        })()`), { depth: 0 });
      } catch (err) {
        result = err;
      }
    
    timeTook = new Date() - start;
    embede = new Discord.MessageEmbed()
      .setTitle('Evaluation')
      .addField("Input:", `\`\`\`js\n${argss}\`\`\``)
      .addField("Output:", `\`\`\`js\n${result}\`\`\``)
      .setColor("BLUE")
      .setTimestamp()
    if (
      args
        .join(" ")
        .toLowerCase()
        .includes("token") &&
      owners.includes(message.author.id)
    ) {
      message.channel.send("I am not going to send your token!");
    } else if (
      result.length > 1024 &&
      result.length < 80000 &&
      owners.includes(message.author.id)
    ) {
      require("hastebin-gen")(result, { extension: "js" }).then(haste =>
        message.channel.send("Result was too big: " + haste)
      );
    } else if (result.length > 80000 && owners.includes(message.author.id)) {
      message.channel.send(
        "I was going to send this in a hastebin, but the result is over 80,000 characters!"
      );
    } else if (owners.includes(message.author.id)) {
      message.channel.send(embede);
    }
  }
};
