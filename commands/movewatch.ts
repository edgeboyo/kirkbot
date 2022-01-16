import * as Discord from "discord.js";

import { getEmojis, moveMessage } from "../jobs/watch";

export default async function(message: Discord.Message, client: Discord.Client, args: string[]) {
	if (message.member == null || message.guild == null || message.mentions.members == null) return;

	if (!message.member.permissions.has("ADMINISTRATOR")) {
		message.reply("Sorry, you don't have permissions to use this!");
		return;
	}

	if (args.length !== 2 || isNaN(Number(args[0]))) {
		message.channel.send("This command needs a watcher id and a new message id");
		return;
	}

	const watcherIndex = Number(args[0]);
	var referredMessage: Discord.Message | undefined;

	try {
		referredMessage =
			message.channel.messages.cache.get(args[1]) || (await message.channel.messages.fetch(args[1]));
	} catch (e) {
		message.channel.send("This message is not valid. Watcher not established...");
		return;
	}

	if (referredMessage === undefined) {
		message.channel.send("This message is not valid. Watcher not established...");
		return;
	}

	if (moveMessage(watcherIndex, referredMessage)) {
		message.reply(`Now watching message ${referredMessage.url}`);
	} else {
		message.reply("Could not move message. Check index");
	}

	const emojis = getEmojis(watcherIndex);

	emojis.forEach(async emoji => {
		await referredMessage?.react(emoji);
	});
}
