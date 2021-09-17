import * as Discord from "discord.js";

type MessageMap = { [id: string]: number };

const watchedMessages: MessageMap = {};

export function watchNewMessage(id: string) {
	watchedMessages[id] = 0;
}

export default {
	setup: async function(client: Discord.Client) {
		client.on("messageReactionAdd", async (reaction, user) => {
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
