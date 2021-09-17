import * as Discord from "discord.js";

import { watchNewMessage } from "../jobs/watch";

export default async function watch(message: Discord.Message, client: Discord.Client, args: string[]) {
	if (message.member == null || message.guild == null || message.mentions.members == null) return;

	if (!message.member.hasPermission("ADMINISTRATOR")) {
		message.reply("Sorry, you don't have permissions to use this!");
		return;
	}

	if (args.length === 0) {
		message.reply("This has not been implemented yet!");
	}

	const referredMessage = message.channel.messages.cache.get(args[0]);

	if (referredMessage === undefined) {
		message.reply("This message is not valid. Watcher not established...");
	}

	watchNewMessage(args[0]);
}
