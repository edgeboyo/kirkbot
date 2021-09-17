import * as Discord from "discord.js";

interface WatcherRules {
	url: string;
	rules: { [id: string]: Discord.Role };
}

type MessageMap = { [id: string]: WatcherRules };

const watchedMessages: MessageMap = {};

export function watchNewMessage(message: Discord.Message) {
	watchedMessages[message.id] = { url: message.url, rules: {} };
}

export function moveMessage(num: number, message: Discord.Message) {
	const key = Object.keys(watchedMessages)[num - 1];

	if (key === undefined) return false;

	const watcher = watchedMessages[key];

	delete watchedMessages[key];

	watcher.url = message.url;

	watchedMessages[message.id] = watcher;
	return true;
}

export function unwatchMessage(num: number) {
	const key = Object.keys(watchedMessages)[num - 1];

	if (key === undefined) return false;

	delete watchedMessages[key];
	return true;
}

export function listRules() {
	const rules = Object.entries(watchedMessages).map(([key, rules], i) => {
		const ruleList = Object.entries(rules.rules)
			.map(([emoji, role], i) => {
				return `\t${i + 1}. ${emoji} -> ${role.name}`;
			})
			.join("\n");
		return `${i + 1}. ${rules.url}\n${ruleList}`;
	});

	return rules.join("\n");
}

export function addNewRule(index: number, emoji: string, role: Discord.Role) {
	const messages = Object.values(watchedMessages);

	const normalizedIndex = index - 1;

	if (normalizedIndex < 0 || messages.length <= normalizedIndex) {
		return false;
	}

	messages[normalizedIndex].rules[emoji] = role;
	return true;
}

export function removeRule(indexMessage: number, indexRule: number) {
	const messages = Object.values(watchedMessages);

	const normalizedMessageIndex = indexMessage - 1;

	if (normalizedMessageIndex < 0 || messages.length <= normalizedMessageIndex) {
		return false;
	}

	const { rules } = messages[normalizedMessageIndex];
	const ruleKeys = Object.keys(rules);

	const normalizedRuleIndex = indexRule - 1;

	if (normalizedRuleIndex < 0 || ruleKeys.length <= normalizedRuleIndex) {
		return false;
	}

	const key = ruleKeys[normalizedRuleIndex];

	delete messages[normalizedMessageIndex].rules[key];
	return true;
}

export default {
	setup: async function(client: Discord.Client) {
		client.on("messageReactionAdd", async (reaction, user) => {
			console.log(user);
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

				const { rules } = watchedMessages[reaction.message.id];

				const emoji = String(reaction.emoji);
				console.log(emoji);
				if (emoji in rules && reaction.message.member !== null) {
					reaction.message.member.roles.add(rules[emoji]);
				}
			}
		});
	}
};
