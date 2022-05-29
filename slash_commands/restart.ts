import { Client, CommandInteraction } from "discord.js";

async function restart(client: Client, interaction: CommandInteraction) {
	if (interaction.member == null || interaction.guild == null) return;
	if (interaction.memberPermissions?.has("ADMINISTRATOR")) {
		await interaction.reply({ content: "I'll be right back", ephemeral: true });
		client.destroy();
		process.exit(1);
	} else {
		await interaction.reply({ content: "You can't do that. It's illegal!", ephemeral: true });
	}
}

export default {
	commandData: { name: "restart", description: "Restart (& possibly update) KirkBot", options: [] },
	handler: restart
};
