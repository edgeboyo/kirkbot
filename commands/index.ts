import * as Discord from "discord.js";

// Add new commands to this file

import ping from "./ping";
import kirk from "./kirk";
import kick from "./kick";
import ban from "./ban";
import purge from "./purge";
import listall from "./listall";
import shutdown from "./shutdown";

const commands: {
	[command: string]: (message: Discord.Message, client: Discord.Client, args: string[]) => Promise<void>;
} = {
	ping,
	kirk,
	kick,
	ban,
	purge,
	listall,
	shutdown
};

export default async function(
	command: string,
	message: Discord.Message,
	client: Discord.Client,
	args: string[]
): Promise<void> {
	await commands[command]?.(message, client, args);
}
