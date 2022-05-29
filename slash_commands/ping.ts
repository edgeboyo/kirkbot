import { Client, CommandInteraction } from "discord.js";

async function ping(client: Client, interaction: CommandInteraction) {
	await interaction.reply({ content: `Pong! API Latency is ${Math.round(client.ws.ping)}ms!`, ephemeral: true });
}

export default { commandData: { name: "ping", description: "Ping command" }, handler: ping };
