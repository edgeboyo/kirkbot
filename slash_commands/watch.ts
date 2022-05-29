import { Client, CommandInteraction, Message } from "discord.js";
import { listRules, watchNewMessage } from "../jobs/watch";

async function watch(client: Client, interaction: CommandInteraction) {
	if (interaction.member == null || interaction.guild == null) return;

	if (!interaction.memberPermissions?.has("ADMINISTRATOR")) {
		interaction.reply("Sorry, you don't have permissions to use this!");
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
		interaction.reply("You can't perform this command out of a text channel");
		return;
	}

	try {
		referredMessage =
			interaction.channel.messages.cache.get(messageId) || (await interaction.channel.messages.fetch(messageId));
	} catch (e) {
		interaction.channel.send("This interaction is not valid. Watcher not established...");
		return;
	}

	if (!referredMessage) {
		interaction.channel.send("This interaction is not valid. Watcher not established...");
		return;
	}

	watchNewMessage(referredMessage);

	interaction.reply(`Now watching interaction ${referredMessage.url}`);
}

export default {
	commandData: {
		name: "watch",
		description: "Watch a message to assign roles to users automagically",
		options: [{ name: "message_id", type: "STRING", description: "ID of Message to watch (leave empty for list)" }]
	},
	handler: watch
};
