import { Client, CommandInteraction } from "discord.js";

async function commandName(client: Client, interaction: CommandInteraction) {
	// do a thing
	// return will not be used
}

export default {
	commandData: { name: "purge", description: "Remove a large amount of messages at once", options: [] },
	handler: commandName
};
