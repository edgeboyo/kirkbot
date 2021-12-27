import * as Discord from "discord.js";
import { addNewRule } from "../jobs/watch";

export default async function(message: Discord.Message, client: Discord.Client, args: string[]) {
	if (message.member == null || message.guild == null || message.mentions.members == null) return;

	if (!message.member.permissions.has("ADMINISTRATOR")) {
		message.reply("Sorry, you don't have permissions to use this!");
		return;
	}

	if (args.length !== 3 || isNaN(Number(args[0]))) {
		message.channel.send(
			"You need to provide 3 arguments:\n1. Index of watcher to attach the rule (use !watch)]\n2.Emoji\n3.Role ID"
		);
		return;
	}

	const ruleIndex = Number(args[0]);
	const emoji = args[1];
	const roleId = args[2];

	const resolvedRole = await message.guild.roles.fetch(roleId);

	if (resolvedRole === null) {
		message.channel.send("Not a valid role :/");
		return;
	}

	if (addNewRule(ruleIndex, emoji, resolvedRole)) {
		message.channel.send("Established new rule");
	} else {
		message.channel.send("Failed to set up new watcher role");
	}
}
