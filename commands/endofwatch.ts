import * as Discord from "discord.js";
import { finishEdit } from "../jobs/watch";

export default async function(message: Discord.Message, client: Discord.Client, args: string[]) {
	if (message.member == null || message.guild == null || message.mentions.members == null) return;

	if (!message.member.hasPermission("ADMINISTRATOR")) {
		message.reply("Sorry, you don't have permissions to use this!");
		return;
	}

	if (finishEdit(message)) {
		message.channel.send("Watcher edit finished! 🎉🎉🎉");
	} else {
		message.channel.send("Unable to finish edit. Maybe you're not editing anything... 🤔");
	}
}
