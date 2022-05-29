import { Client, CommandInteraction } from "discord.js";
import { unwatchMessage } from "../jobs/watch";

async function endofwatch(client: Client, interaction: CommandInteraction) {
	if (interaction.member == null || interaction.guild == null) return;

	if (!interaction.memberPermissions?.has("ADMINISTRATOR")) {
		interaction.reply({ content: "Sorry, you don't have permissions to use this!", ephemeral: true });
		return;
	}

	const watcherIndex = interaction.options.getInteger("watcher_id", true);

	if (unwatchMessage(watcherIndex)) {
		interaction.reply({ content: "Watcher removed! 🎉🎉🎉", ephemeral: true });
	} else {
		interaction.reply({ content: "Unable to remove watcher. Maybe check index... 🤔", ephemeral: true });
	}
}

export default {
	commandData: {
		name: "endofwatch",
		description: "Stop watching message reactions",
		options: [
			{
				name: "watcher_id",
				type: "INTEGER",
				description: "ID of the watcher to remove - use /watch for all ids",
				required: true
			}
		]
	},
	handler: endofwatch
};
