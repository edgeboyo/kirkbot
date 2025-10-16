// Load up the discord.js library
import * as Discord from "discord.js";

const { Intents } = Discord;

// This is your client. Some people call it `bot`, some people call it `self`,
// some might call it `cootchie`. Either way, when you see `client.something`, or `bot.something`,
// this is what we're refering to. Your client.
const client = new Discord.Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MEMBERS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
		Intents.FLAGS.DIRECT_MESSAGES,
		Intents.FLAGS.GUILD_BANS
	],
	partials: ["MESSAGE", "CHANNEL", "REACTION"]
});

import { Config, getConfigJson } from "./common";

import { setupJobs, readyJobs } from "./jobs";
import { setupCommands, validateCommands } from "./slash_commands";

client.on("ready", () => {
	// This event will run if the bot starts, and logs in, successfully.
	console.log(
		`Bot has started, with ${client.users.cache.size} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds.`
	);

	readyJobs(client);

	validateCommands();

	setupCommands(client);
});

client.on("guildCreate", guild => {
	// This event triggers when the bot joins a guild.
	console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
});

client.on("guildDelete", guild => {
	// this event triggers when the bot is removed from a guild.
	console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
});

setupJobs(client).then(async () => {
	// Here we load the config.json file that contains our token and our prefix values.
	const config = await getConfigJson(Config.AUTH);
	// config.token contains the bot's token
	// config.prefix contains the message prefix.

	client.login(config.token);
});



