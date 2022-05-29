import { Client, CommandInteraction } from "discord.js";

async function commandName(client: Client, interaction: CommandInteraction) {
	// do a thing
	// return will not be used
}

export default {
	commandData: { name: "help", description: "Get a DM with some pointers of how to use KirkBot", options: [] },
	handler: commandName
};
