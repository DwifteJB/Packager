/*
*/

import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
global.rootFolder = __dirname

import dotenv from 'dotenv'
dotenv.config()

const { clientSettings } = JSON.parse(fs.readFileSync("./src/config.json"));
clientSettings.ws = {
    properties: { $browser: 'Discord iOS' }
}
import * as fs from 'fs';

import {LoadJSON} from './src/lib/repoUpdate.js';
import {Loader} from './src/lib/Loader.js';

import {Client, IntentsBitField} from 'discord.js';
  
const Indt = new IntentsBitField()
Indt.add(IntentsBitField.Flags.GuildMessages,IntentsBitField.Flags.GuildPresences, IntentsBitField.Flags.GuildMembers,IntentsBitField.Flags.Guilds,IntentsBitField.Flags.MessageContent);
clientSettings.intents = Indt

const client = new Client(clientSettings);
new Loader(client)

console.log("Loading JSONs...")
LoadJSON(client)

client.login(process.env.TOKEN);
