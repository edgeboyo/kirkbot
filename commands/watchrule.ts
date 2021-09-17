import * as Discord from "discord.js";
import { addNewRule } from "../jobs/watch";

export default async function(message: Discord.Message, client: Discord.Client, args: string[]) {
	console.log(args);
	if (message.member == null || message.guild == null || message.mentions.members == null || args.length !== 2)
		return;

	const resolvedRole = await message.guild.roles.fetch(args[1]);

	message.channel.send("Setting up...");

	if (resolvedRole === null) {
		message.channel.send("Not a valid role :/");
		return;
	}

	addNewRule(message, args[0], resolvedRole);
}
