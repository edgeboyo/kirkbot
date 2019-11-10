import * as Discord from "discord.js";

export default async function(message: Discord.Message, client: Discord.Client, args: string[]) {
	if (
		message.member.hasPermission("ADMINISTRATOR") &&
		(message.guild.id == "629265673666822144" || message.guild.id == "634026138527596554")
	) {
		await message.channel.send("I'll be right back");
		client.destroy();
		process.exit(1);
	} else {
		await message.channel.send("You can't do that. It's illegal!");
	}
}
