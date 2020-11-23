const exec = require('child_process').exec
const { owners } = require("../config.json");

module.exports = {
  name: "update",
  description: "Update Siri using git.",
  type: 'private',
  async execute(client, message, args) {
    if(owners.includes(message.author.id)) {
    message.channel.send(`**Updating...**`).then(msg => {
      exec('git pull', {}, (e, o, se) => {
        if(e) {
          console.error("[Siri : Update] " + e);
          return msg.edit(`Some error occured. Try again later.`);
        }
        msg.edit('**Update finished.**');
        exec('pm2 restart index.js')
        message.delete()
      });
    });
    }
  }
} 
