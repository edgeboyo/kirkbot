import { Client, CommandInteraction } from "discord.js";

async function commandName(client: Client, interaction: CommandInteraction) {
	// do a thing
	// return will not be used
}

export default {
	commandData: { name: "restart", description: "Restart (& possibly update) KirkBot", options: [] },
	handler: commandName
};
