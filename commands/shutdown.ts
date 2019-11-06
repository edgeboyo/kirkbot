import * as Discord from "discord.js";

export default async function(message: Discord.Message, client: Discord.Client, args: string[]) {
	if (message.member.hasPermission("ADMINISTRATOR")) {
		await message.channel.send("Oh, it's XX:30. Yeah you can go. Goodbye");
		client.destroy();
		process.exit(1);
	} else {
		await message.channel.send("You can't do that. It's illegal!");
	}
}
