import { Client, CommandInteraction } from "discord.js";

async function kirk(client: Client, interaction: CommandInteraction) {
	const message = interaction.options.getString("message", true);

	if (interaction.channel == null || !interaction.channel.isText()) {
		interaction.reply({ content: "Can't use kirk in this context", ephemeral: true });
		return;
	}
	await interaction.channel.send(message);
	interaction.reply({ content: "Sent your message ;)", ephemeral: true });
}

export default {
	commandData: {
		name: "kirk",
		description: "Make KirkBot say something",
		options: [
			{ name: "message", type: "STRING", description: "Message for KirkBot to say", required: true }
		]
	},
	handler: kirk
};
