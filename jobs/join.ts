import * as Discord from "discord.js";

export default {
	ready: async function(client: Discord.Client) {
		var allGuilds = Array.from(client.guilds.values());
		for (var i = 0; i < allGuilds.length; i++) {
			var guild = allGuilds[i];
			var chnl = guild.channels.find(
				channel => channel.name == "general" && channel.type == "text"
			) as Discord.TextChannel;
			chnl.send("OMG! I'm alive!");
		}
	}
};
