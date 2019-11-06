import * as Discord from "discord.js";

export default async function(message: Discord.Message, client: Discord.Client, args: string[]) {
	await message.channel.send(
		"List of all servers:\n" +
			Array.from(client.guilds.values())
				.map(g => g.name)
				.join("\n")
	);
}
