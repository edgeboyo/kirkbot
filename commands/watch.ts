import * as Discord from "discord.js";

import { listRules, watchNewMessage } from "../jobs/watch";

export default async function(message: Discord.Message, client: Discord.Client, args: string[]) {
	if (message.member == null || message.guild == null || message.mentions.members == null) return;

	if (!message.member.hasPermission("ADMINISTRATOR")) {
		message.reply("Sorry, you don't have permissions to use this!");
		return;
	}

	if (args.length === 0) {
		const watchList = listRules();
		message.channel.send(watchList.length === 0 ? "The watcher list is empty" : watchList);
		return;
	}

	const referredMessage =
		message.channel.messages.cache.get(args[0]) || (await message.channel.messages.fetch(args[0]));

	if (referredMessage === undefined) {
		message.channel.send("This message is not valid. Watcher not established...");
		return;
	}

	watchNewMessage(referredMessage);

	referredMessage.react("👂");
	message.reply(`Now watching message ${referredMessage.url}`);
}
