import { Client, CommandInteraction } from "discord.js";

async function kirk(client: Client, interaction: CommandInteraction) {
	const message = interaction.options.getString("message", true);
	const convert = interaction.options.getBoolean("covert");

	if (convert == null || !convert) {
		interaction.reply(message);
	} else {
		if (interaction.channel == null || !interaction.channel.isText()) {
			interaction.reply({ content: "Can't use covert in this context", ephemeral: true });
			return;
		}
		await interaction.channel.send(message);
		interaction.reply({ content: "Sent your message secretly ;)", ephemeral: true });
	}
}

export default {
	commandData: {
		name: "kirk",
		description: "Make KirkBot say something",
		options: [
			{ name: "message", type: "STRING", description: "Message for KirkBot to say", required: true },
			{ name: "covert", type: "BOOLEAN", description: "Set to True to not reveal who sent the message" }
		]
	},
	handler: kirk
};
