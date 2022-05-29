import { Client, CommandInteraction, Message } from "discord.js";
import { listRules, watchNewMessage } from "../jobs/watch";

async function watch(client: Client, interaction: CommandInteraction) {
	if (interaction.member == null || interaction.guild == null) return;

	if (!interaction.memberPermissions?.has("ADMINISTRATOR")) {
		interaction.reply({ content: "Sorry, you don't have permissions to use this!", ephemeral: true });
		return;
	}

	const messageId = interaction.options.getString("message_id", false);

	if (messageId === null) {
		const watchList = listRules();
		interaction.reply({
			content: watchList.length === 0 ? "The watcher list is empty" : watchList,
			ephemeral: true
		});
		return;
	}

	var referredMessage: Message | undefined;

	if (interaction.channel == null) {
		interaction.reply({ content: "You can't perform this command out of a text channel", ephemeral: true });
		return;
	}

	try {
		referredMessage =
			interaction.channel.messages.cache.get(messageId) || (await interaction.channel.messages.fetch(messageId));
	} catch (e) {
		interaction.reply({ content: "This interaction is not valid. Watcher not established...", ephemeral: true });
		return;
	}

	if (!referredMessage) {
		interaction.reply({ content: "This interaction is not valid. Watcher not established...", ephemeral: true });
		return;
	}

	watchNewMessage(referredMessage);

	interaction.reply({ content: `Now watching interaction ${referredMessage.url}`, ephemeral: true });
}

export default {
	commandData: {
		name: "watch",
		description: "Watch a message to assign roles to users automagically",
		options: [{ name: "message_id", type: "STRING", description: "ID of Message to watch (leave empty for list)" }]
	},
	handler: watch
};
