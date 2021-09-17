import * as Discord from "discord.js";

import { moveMessage } from "../jobs/watch";

export default async function(message: Discord.Message, client: Discord.Client, args: string[]) {
	if (message.member == null || message.guild == null || message.mentions.members == null) return;

	if (!message.member.hasPermission("ADMINISTRATOR")) {
		message.reply("Sorry, you don't have permissions to use this!");
		return;
	}

	if (args.length !== 2 || isNaN(Number(args[0]))) {
		message.channel.send("This command needs a watcher id and a new message id");
		return;
	}

	const referredMessage =
		message.channel.messages.cache.get(args[1]) || (await message.channel.messages.fetch(args[0]));

	if (referredMessage === undefined) {
		message.channel.send("This message is not valid. Watcher not established...");
		return;
	}

	if (moveMessage(Number(args[0]), referredMessage)) {
		message.reply(`Now watching message ${referredMessage.url}`);
	} else {
		message.reply("Could not move message. Check index");
	}
}
