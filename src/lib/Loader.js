
import * as fs from 'fs';
import * as path from 'path'
import * as RepoUpdate from './repoUpdate.js'
import {Collection} from 'discord.js';

import {createRequire} from "module";
const require = createRequire(import.meta.url)

export class Loader {
    constructor(client) {
        this.client = client
        client.commands = new Collection();
        client.prefix = '!'
        client.jsons = new Collection();
        client.cooldowns = new Collection();
        client.saves = new Collection()

        const folder = fs.readdirSync(path.join(global.rootFolder,"src","commands")).filter(file => file.endsWith('.js'));
        console.log("╭────────────────────┬──╮");
        for (const file of folder) {
            try {
            const command = require(path.join(global.rootFolder,"src","commands",file));
            const boxCmdName = `${command.name}`.padEnd(20);
            console.log(`│${boxCmdName}│✅│`);
            console.log('├────────────────────┼──┤');
            client.commands.set(command.name, command);
            } catch (error) {
            const boxCmdName = `${file}`.padEnd(20);
            console.log(`│${boxCmdName}│❌│`);
            //console.log(error)
            }
        }
        console.log('╰────────────────────┴──╯');

        fs.readdir(path.join(global.rootFolder,"src","events"), (err, files) => {
            if (err) return console.error;
            for (const file of files) {
              if (!file.endsWith(".js")) return;
              const evt = require(path.join(global.rootFolder,"src","events",file));
              let evtName = file.split(".")[0];
              client.on(evtName, evt.bind(null, client));
            };
            console.log(`Loaded ${files.length} events`)
        })

    }
}
