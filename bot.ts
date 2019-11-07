// Load up the discord.js library
import * as Discord from "discord.js";

// This is your client. Some people call it `bot`, some people call it `self`,
// some might call it `cootchie`. Either way, when you see `client.something`, or `bot.something`,
// this is what we're refering to. Your client.
const client = new Discord.Client();

// Here we load the config.json file that contains our token and our prefix values.
import config from "./auth.json";
// config.token contains the bot's token
// config.prefix contains the message prefix.

import runCommand from "./commands";
import { setupJobs, readyJobs } from "./jobs";

client.on("ready", () => {
	// This event will run if the bot starts, and logs in, successfully.
	console.log(
		`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`
	);

	readyJobs(client);
});

client.on("guildCreate", guild => {
	// This event triggers when the bot joins a guild.
	console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
});

client.on("guildDelete", guild => {
	// this event triggers when the bot is removed from a guild.
	console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
});

client.on("message", async message => {
	// This event will run on every single message received, from any channel or DM.

	// It's good practice to ignore other bots. This also makes your bot ignore itself
	// and not get into a spam loop (we call that "botception").
	if (message.author.bot) return;

	// Also good practice to ignore any message that does not start with our prefix,
	// which is set in the configuration file.
	if (message.content.indexOf(config.prefix) !== 0) return;

	// Here we separate our "command" name, and our "arguments" for the command.
	// e.g. if we have the message "+say Is this the real life?" , we'll get the following:
	// command = say
	// args = ["Is", "this", "the", "real", "life?"]
	const args = message.content
		.slice(config.prefix.length)
		.trim()
		.split(/ +/g);
	const command = args.shift()?.toLowerCase();

	if (command == undefined) {
		return;
	}

	await runCommand(command, message, client, args);
});

setupJobs(client).then(() => {
	client.login(config.token);
});
