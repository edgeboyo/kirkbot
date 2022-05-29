import { Client, CommandInteraction } from "discord.js";

const farewellMessages = ["Oh, it's XX:30. Yeah you can go. Goodbye", "I see. I'll leave you be.", "I'm Morbin' Out"];

async function shutdown(client: Client, interaction: CommandInteraction) {
	if (interaction.member == null || interaction.guild == null) return;
	if (interaction.memberPermissions?.has("ADMINISTRATOR")) {
		await interaction.reply(farewellMessages[Math.floor(Math.random() * farewellMessages.length)]);
		client.destroy();
		process.exit(0);
	} else {
		await interaction.reply({ content: "You can't do that. It's illegal!", ephemeral: true });
	}
}

export default {
	commandData: { name: "shutdown", description: "Turn KirkBot off entirely :(", options: [] },
	handler: shutdown
};
