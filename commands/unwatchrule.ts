import * as Discord from "discord.js";
import { removeRule } from "../jobs/watch";

export default async function(message: Discord.Message, client: Discord.Client, args: string[]) {
	if (message.member == null || message.guild == null || message.mentions.members == null) return;

	if (!message.member.permissions.has("ADMINISTRATOR")) {
		message.reply("Sorry, you don't have permissions to use this!");
		return;
	}

	if (args.length != 2 || isNaN(Number(args[0])) || isNaN(Number(args[1]))) {
		message.channel.send(
			"You must provide a 2 numbers to remove. Use !watch to get index of watcher and rule to remove."
		);
		return;
	}

	if (removeRule(Number(args[0]), Number(args[1]))) {
		message.channel.send("Rule removed! 🎉🎉🎉");
	} else {
		message.channel.send("Unable to remove rule. Maybe check indices... 🤔");
	}
}
