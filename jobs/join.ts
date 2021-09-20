import * as Discord from "discord.js";

const welcomeMessages = ["OMG! I'm alive!", "Hi there!", "*struggles with zoom* Hello students!"];

export default {
	ready: async function(client: Discord.Client) {
		let allGuilds = Array.from(client.guilds.cache.values());
		await Promise.all(
			allGuilds.map(async guild => {
				let chan = guild.channels.cache.find(channel => channel.name == "general") as Discord.TextChannel;
				try {
					let msgs = await chan.messages.fetch({ limit: 5 });
					let msg = msgs
						.filter(msg => msg.author.id == client.user!.id)
						.find(msg => welcomeMessages.includes(msg.content));
					// If a welcome message has been posted by the bot in the last 5 messages, return
					if (msg != null) {
						return;
					}
				} catch {} // Ignore all exceptions
				chan.send(welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)]);
			})
		);
	}
};
