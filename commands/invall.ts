import * as Discord from "discord.js";
import { promises } from "dns";

export default async function(message: Discord.Message, client: Discord.Client, args: string[]) {
	if (
		message.member.hasPermission("ADMINISTRATOR") &&
		(message.guild.id == "629265673666822144" || message.guild.id == "634026138527596554")
	) {
		await message.channel.send("Check your DMs!");

		await message.author.send(
			"Invites to all servers:\n" +
				(
					await Promise.all(
						Array.from(client.guilds.values()).map(async g => {
							let channel = g.channels.find(chan => chan.name == "general" && chan.type == "text");
							// If there are no general channels, find a text channel
							if (channel == null) {
								channel = g.channels.find(chan => chan.type == "text");

								if (channel == null) {
									return "No text channels found!";
								}
							}

							let invite = await channel.createInvite({ maxAge: 10 * 60 });
							return invite.url;
						})
					)
				).join("\n")
		);
	} else {
		await message.channel.send("You can't do that. It's illegal!");
	}
}
