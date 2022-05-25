import { Client, CommandInteraction } from "discord.js";

export async function ping(client: Client, interaction: CommandInteraction) {
	await interaction.reply("Pong");
}
