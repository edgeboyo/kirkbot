import * as Discord from "discord.js";

export default async function(message: Discord.Message, client: Discord.Client, args: string[]) {
	if (
		message.member.hasPermission("ADMINISTRATOR") &&
		(message.guild.id == "629265673666822144" || message.guild.id == "634026138527596554")
	) {
		await message.channel.send("Check your DMs!");
		await message.author.send(
			"Invites to all servers:\n" /* +
				Array.from(client.guilds.values())
					.map(g => g.channels.find(
						channel => channel.name == "general" && channel.type == "text"
					).createInvite())
					.join("\n") */
		);
		var arr = Array.from(client.guilds.values());
		for(var i = 0; i<arr.length; i++){
			//var ch = arr[i].defaultChannel;
			var ch = arr[i].channels.find(
						channel => channel.name == "general" && channel.type == "text"
					);
			message.author.send(arr[i].name + (ch ? ch.createInvite() : "CHANNEL NOT FOUND"));
		}
	} else {
		await message.channel.send("You can't do that. It's illegal!");
	}
	
}
