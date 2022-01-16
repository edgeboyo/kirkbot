import * as Discord from "discord.js";
import { unwatchMessage } from "../jobs/watch";

export default async function(message: Discord.Message, client: Discord.Client, args: string[]) {
	if (message.member == null || message.guild == null || message.mentions.members == null) return;

	if (!message.member.permissions.has("ADMINISTRATOR")) {
		message.reply("Sorry, you don't have permissions to use this!");
		return;
	}

	if (args.length != 1 || isNaN(Number(args[0]))) {
		message.channel.send("You must provide a number to remove. Use !watch to get index of rule to remove.");
		return;
	}

	const ruleIndex = Number(args[0]);

	if (unwatchMessage(ruleIndex)) {
		message.channel.send("Watcher removed! 🎉🎉🎉");
	} else {
		message.channel.send("Unable to remove watcher. Maybe check index... 🤔");
	}
}
