import * as Discord from "discord.js";

export default async function(message: Discord.Message, client: Discord.Client, args: string[]) {
	// This command removes all messages from all users in the channel, up to 100.
	if (message.member == null || message.guild == null) return;

	if (message.member.permissions.has("ADMINISTRATOR")) {
		// get the delete count, as an actual number.
		const deleteCount = parseInt(args[0], 10);

		// Ooooh nice, combined conditions. <3
		if (!deleteCount || deleteCount < 2 || deleteCount > 100) {
			message.reply("Please provide a number between 2 and 100 for the number of messages to delete");
			return;
		}

		// So we get our messages, and delete them. Simple enough, right?
		const fetched = await message.channel.messages.fetch({
			limit: deleteCount
		});
		/* POSSIBLY DOESN'T WORK ANYMORE
		message.channel
			.messages.delete(fetched)
			.catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
		*/
		Array.from(fetched.values()).forEach(function(mes) {
			message.channel.messages.delete(mes);
		});
	} else {
		message.reply("Sorry, you don't have permissions to use this!");
		return;
	}
}
