import { Client, CommandInteraction } from "discord.js";

async function pingu(client: Client, interaction: CommandInteraction) {
	await interaction.reply({ files: ["pic/pingu.png"] });
}

export default { commandData: { name: "pingu", description: "Show me a funny bird" }, handler: pingu };
