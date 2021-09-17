import * as Discord from "discord.js";

interface WatcherRules {
	inEdit: boolean;
	url: string;
	rules: Map<Discord.Emoji, Discord.Role>;
}

type MessageMap = { [id: string]: WatcherRules };

const watchedMessages: MessageMap = {};

export function watchNewMessage(message: Discord.Message) {
	watchedMessages[message.id] = { inEdit: true, url: message.url, rules: new Map() };
}

export function listRules() {
	const rules = Object.entries(watchedMessages).map(([key, rules], i) => {
		return `${i + 1}. ${rules.url}`;
	});

	return rules.join("\n");
}

export default {
	setup: async function(client: Discord.Client) {
		client.on("messageReactionAdd", async (reaction, user) => {
			if (user.bot) {
				return;
			}
			// When a reaction is received, check if the structure is partial
			if (reaction.partial) {
				// If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
				try {
					await reaction.fetch();
				} catch (error) {
					console.error("Something went wrong when fetching the message:", error);
					// Return as `reaction.message.author` may be undefined/null
					return;
				}
			}

			if (reaction.message.id in watchedMessages) {
				// Now the message has been cached and is fully available
				console.log(`${reaction.message.author}'s message "${reaction.message.content}" gained a reaction!`);
				// The reaction is now also fully available and the properties will be reflected accurately:
				console.log(`${reaction.count} user(s) have given the same reaction to this message!`);
			}
		});
	}
};
