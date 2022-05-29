import { Client, CommandInteraction } from "discord.js";
import { removeRule } from "../jobs/watch";

async function unwatchrule(client: Client, interaction: CommandInteraction) {
	if (interaction.member == null || interaction.guild == null) return;

	if (!interaction.memberPermissions?.has("ADMINISTRATOR")) {
		interaction.reply({ content: "Sorry, you don't have permissions to use this!", ephemeral: true });
		return;
	}

	const watcherId = interaction.options.getInteger("watcher_id", true);
	const ruleId = interaction.options.getInteger("rule_id", true);

	if (removeRule(watcherId, ruleId)) {
		interaction.reply({ content: "Rule removed! 🎉🎉🎉", ephemeral: true });
	} else {
		interaction.reply({ content: "Unable to remove rule. Maybe check indices... 🤔", ephemeral: true });
	}
}

export default {
	commandData: {
		name: "unwatchrule",
		description: "Remove a watcher assignment rule from a specific watcher",
		options: [
			{
				name: "watcher_id",
				type: "INTEGER",
				description: "ID of the watcher to removed assigned rule from - use /watch for all ids",
				required: true
			},
			{
				name: "rule_id",
				type: "INTEGER",
				description: "ID of the rule from the watcher to remove - use /watch for all watcher and rule ids",
				required: true
			}
		]
	},
	handler: unwatchrule
};
