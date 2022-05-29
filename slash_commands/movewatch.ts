import { Client, CommandInteraction, Message } from "discord.js";
import { moveMessage, getEmojis } from "../jobs/watch";

async function movewatch(client: Client, interaction: CommandInteraction) {
	if (interaction.member == null || interaction.guild == null) return;

	if (!interaction.memberPermissions?.has("ADMINISTRATOR")) {
		interaction.reply({ content: "Sorry, you don't have permissions to use this!", ephemeral: true });
		return;
	}

	const watcherIndex = interaction.options.getInteger("watcher_id", true);
	const messageId = interaction.options.getString("message_id", true);
	var referredMessage: Message | undefined;

	if (interaction.channel == null) {
		interaction.reply({ content: "You can't perform this command out of a text channel", ephemeral: true });
		return;
	}

	try {
		referredMessage =
			interaction.channel.messages.cache.get(messageId) || (await interaction.channel.messages.fetch(messageId));
	} catch (e) {
		interaction.reply({ content: "This message is not valid. Watcher not established...", ephemeral: true });
		return;
	}

	if (referredMessage === undefined) {
		interaction.reply({ content: "This message is not valid. Watcher not established...", ephemeral: true });
		return;
	}

	if (moveMessage(watcherIndex, referredMessage)) {
		interaction.reply({ content: `Now watching message ${referredMessage.url}`, ephemeral: true });
	} else {
		interaction.reply({ content: "Could not move message. Check index", ephemeral: true });
		return;
	}

	const emojis = getEmojis(watcherIndex);

	emojis.forEach(async emoji => {
		await referredMessage?.react(emoji);
	});
}

export default {
	commandData: {
		name: "movewatch",
		description: "Move the watcher from one message to another (even between channels)",
		options: [
			{
				name: "watcher_id",
				type: "INTEGER",
				description: "ID of the watcher to move - use /watch for all ids",
				required: true
			},
			{
				name: "message_id",
				type: "STRING",
				description: "ID of Message to move the watcher too",
				required: true
			}
		]
	},
	handler: movewatch
};
