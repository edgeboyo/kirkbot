import { Client, CommandInteraction, Message } from "discord.js";

async function react(client: Client, interaction: CommandInteraction) {
	if (interaction.member == null || interaction.guild == null) return;

	if (!interaction.memberPermissions?.has("ADD_REACTIONS")) {
		interaction.reply({
			content: "Sorry, you don't have permissions to use this in this channel!",
			ephemeral: true
		});
		return;
	}

	const messageId = interaction.options.getString("message_id", true);
	const emojis = interaction.options.getString("emojis", true);

	var referredMessage: Message;

	if (interaction.channel == null) {
		interaction.reply({ content: "You can't perform this command out of a text channel", ephemeral: true });
		return;
	}

	try {
		referredMessage =
			interaction.channel.messages.cache.get(messageId) || (await interaction.channel.messages.fetch(messageId));

		if (referredMessage === undefined) throw "Lookup resulted in undefined";
	} catch (e) {
		interaction.reply({ content: "This message is not valid. Watcher not established...", ephemeral: true });
		return;
	}

	if (referredMessage === undefined) {
		interaction.reply({ content: "This message is not valid. Watcher not established...", ephemeral: true });
		return;
	}

	await interaction.deferReply({ ephemeral: true });

	var reactions = 0;

	await Promise.all(
		emojis.split(" ").map(async emoji => {
			if (emoji.length == 0) {
				return;
			}

			try {
				await referredMessage.react(emoji);
				reactions++;
			} catch (e) {}
		})
	);
	await interaction.editReply({ content: `Parsed and reacted with ${reactions} reactions` });
}

export default {
	commandData: {
		name: "react",
		description: "Have KirkBot react to a message with a set of emojis",
		options: [
			{
				name: "message_id",
				type: "STRING",
				description: "ID of message to react to",
				required: true
			},
			{
				name: "emojis",
				type: "STRING",
				description: "Space separated list of emojis to use as reactions",
				required: true
			}
		]
	},
	handler: react
};
