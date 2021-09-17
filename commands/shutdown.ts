import * as Discord from "discord.js";

const farewellMessages = ["Oh, it's XX:30. Yeah you can go. Goodbye", "I see. I'll leave you be."];

export default async function(message: Discord.Message, client: Discord.Client, args: string[]) {
	if (message.member == null || message.guild == null) return;
	if (message.member.hasPermission("ADMINISTRATOR")) {
		await message.channel.send(farewellMessages[Math.floor(Math.random() * farewellMessages.length)]);
		client.destroy();
		process.exit(0);
	} else {
		await message.channel.send("You can't do that. It's illegal!");
	}
}
