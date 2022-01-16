import * as Discord from "discord.js";
import { readFile, writeFile } from "fs";

interface WatcherRules {
	url: string;
	rules: { [id: string]: Discord.Role };
	guildId: string;
}

type MessageMap = { [id: string]: WatcherRules };

const watchedMessages: MessageMap = {};

export function watchNewMessage(message: Discord.Message) {
	if (message.guild === null || message.guild === undefined) return;

	watchedMessages[message.id] = {
		url: message.url,
		guildId: message.guild.id,
		rules: {}
	};

	saveWatchers();
}

export function moveMessage(num: number, message: Discord.Message) {
	const key = Object.keys(watchedMessages)[num - 1];

	if (key === undefined) return false;

	const watcher = watchedMessages[key];

	delete watchedMessages[key];

	watcher.url = message.url;

	watchedMessages[message.id] = watcher;
	saveWatchers();
	return true;
}

export function unwatchMessage(num: number) {
	const key = Object.keys(watchedMessages)[num - 1];

	if (key === undefined) return false;

	delete watchedMessages[key];
	saveWatchers();
	return true;
}

export function getEmojis(num: number) {
	const rules = Object.values(watchedMessages)[num - 1];

	const emojis = Object.keys(rules.rules);

	return emojis;
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
	saveWatchers();
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
	saveWatchers();
	return true;
}

function saveWatchers() {
	const normalizedWatchers = Object.entries(watchedMessages).map(([messageId, details]) => {
		const { rules, ...ids } = details;

		const normalizedRules = Object.fromEntries(
			Object.entries(rules).map(([emoji, role]) => {
				return [emoji, role.id];
			})
		);

		return {
			messageId: messageId,
			rules: normalizedRules,
			...ids
		};
	});

	writeFile("watcherFile.json", JSON.stringify(normalizedWatchers, null, 2), function(err) {
		if (err) {
			console.error("[ERROR] Write error: ", err);
		}
	});
}

interface WatcherFileEntry {
	messageId: string;
	url: string;
	rules: { [id: string]: string };
	guildId: string;
}

async function loadWatchers(client: Discord.Client) {
	try {
		readFile("./watcherFile.json", (err, data) => {
			if (err) return;
			const watcherFileContents = JSON.parse(data.toString());

			watcherFileContents.forEach(async (entry: WatcherFileEntry) => {
				const { messageId, url, rules, guildId } = entry;

				const guild = client.guilds.cache.get(guildId);

				if (guild === undefined) return undefined;

				const coupledRules: { [id: string]: Discord.Role } = {};

				if (rules !== undefined) {
					Object.entries(rules).forEach(async ([emoji, ruleId]) => {
						const role = await guild.roles.fetch(ruleId);

						if (role === null) {
							return;
						}

						coupledRules[emoji] = role;
					});
				}

				watchedMessages[messageId] = {
					guildId,
					url,
					rules: coupledRules
				};
			});
		});
	} catch (err) {
		console.error("[WARN] Failed to obtain watcherFile: ", err);
		return;
	}
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
				} catch (err) {
					console.error("[WARN] Something went wrong when fetching the message:", err);
					// Return as `reaction.message.author` may be undefined/null
					return;
				}
			}

			if (reaction.message.id in watchedMessages) {
				const { rules } = watchedMessages[reaction.message.id];

				const emoji = String(reaction.emoji);
				if (emoji in rules && reaction.message.guild !== null) {
					try {
						const member =
							reaction.message.guild.members.cache.get(user.id) ||
							(await reaction.message.guild.members.fetch(user.id));
						member.roles.add(rules[emoji]);
					} catch (e) {
						return;
					}
				}
			}
		});

		client.on("messageReactionRemove", async (reaction, user) => {
			if (user.bot) {
				return;
			}
			// When a reaction is received, check if the structure is partial
			if (reaction.partial) {
				// If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
				try {
					await reaction.fetch();
				} catch (err) {
					console.error("[WARN] Something went wrong when fetching the message:", err);
					// Return as `reaction.message.author` may be undefined/null
					return;
				}
			}

			if (reaction.message.id in watchedMessages) {
				const { rules } = watchedMessages[reaction.message.id];

				const emoji = String(reaction.emoji);
				if (emoji in rules && reaction.message.guild !== null) {
					try {
						const member =
							reaction.message.guild.members.cache.get(user.id) ||
							(await reaction.message.guild.members.fetch(user.id));
						member.roles.remove(rules[emoji]);
					} catch (e) {
						return;
					}
				}
			}
		});
	},
	ready: async function(client: Discord.Client) {
		await loadWatchers(client);
	}
};
