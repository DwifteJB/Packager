/*
    Packager Client
*/

import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
global.rootFolder = __dirname;

import dotenv from "dotenv";
dotenv.config();

import fetch from "node-fetch";
const result = await fetch(
  "https://raw.githubusercontent.com/itsnebulalol/ios15-tweaks/main/data/tweaks.json"
);
const data = await result.json();

fs.writeFileSync("./src/iOS15.json", JSON.stringify(data, null, 4));

const { clientSettings } = JSON.parse(fs.readFileSync("./src/config.json"));
clientSettings.ws = {
  properties: { $browser: "Discord iOS" },
};
import * as fs from "fs";

import { LoadJSON } from "./src/lib/repoUpdate.js";
import { Loader, SlashCommandLoader } from "./src/lib/Loader.js";

import { Client, IntentsBitField } from "discord.js";

const Indt = new IntentsBitField();
Indt.add(
  IntentsBitField.Flags.GuildMessages,
  IntentsBitField.Flags.GuildPresences,
  IntentsBitField.Flags.GuildMembers,
  IntentsBitField.Flags.Guilds,
  IntentsBitField.Flags.MessageContent
);
clientSettings.intents = Indt;

const client = new Client(clientSettings);
await client.login(process.env.TOKEN);
new Loader(client);
await new SlashCommandLoader(client).Load();

console.log("Loading JSONs...");
await LoadJSON(client);

setInterval(() => {
  client.emit("addRepo", "");
}, 60000 * 60);
