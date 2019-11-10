import * as Discord from "discord.js";

const welcomeMessages = ["OMG! I'm alive!"];

export default {
	ready: async function(client: Discord.Client) {
		let allGuilds = Array.from(client.guilds.values());
		await Promise.all(
			allGuilds.map(async guild => {
				let chan = guild.channels.find(
					channel => channel.name == "general" && channel.type == "text"
				) as Discord.TextChannel;
				try {
					let msgs = await chan.fetchMessages({ limit: 5 });
					let msg = msgs
						.filter(msg => msg.author.id == client.user.id)
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
