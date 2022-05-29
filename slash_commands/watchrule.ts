import { Client, CommandInteraction, Role } from "discord.js";
import { addNewRule } from "../jobs/watch";

async function watchrule(client: Client, interaction: CommandInteraction) {
	if (interaction.member == null || interaction.guild == null) return;

	if (!interaction.memberPermissions?.has("ADMINISTRATOR")) {
		interaction.reply({ content: "Sorry, you don't have permissions to use this!", ephemeral: true });
		return;
	}

	const watcherIndex = interaction.options.getInteger("watcher_id", true);
	const emoji = interaction.options.getString("emoji", true);
	const role = interaction.options.getRole("role", true);

	if (!(role instanceof Role)) {
		interaction.reply({ content: "Not a valid role :/", ephemeral: true });
		return;
	}

	if (addNewRule(watcherIndex, emoji, role)) {
		interaction.reply({ content: "Established new rule", ephemeral: true });
	} else {
		interaction.reply({ content: "Failed to set up new watcher role", ephemeral: true });
	}
}

export default {
	commandData: {
		name: "watchrule",
		description: "Move the watcher from one message to another (even between channels)",
		options: [
			{
				name: "watcher_id",
				type: "INTEGER",
				description: "ID of the watcher to assign new rule to - use /watch for all ids",
				required: true
			},
			{
				name: "emoji",
				type: "STRING",
				description: "Emoji to watch for under this message",
				required: true
			},
			{
				name: "role",
				type: "ROLE",
				description: "Role to assign when a member reacts under this message",
				required: true
			}
		]
	},
	handler: watchrule
};
