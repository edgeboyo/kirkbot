import { Client, CommandInteraction } from "discord.js";

async function commandName(client: Client, interaction: CommandInteraction) {
	// do a thing
	// return will not be used
}

export default {
	commandData: {
		name: "watchrule",
		description: "Assign a role to be allocated when a reaction is encountered (on a specific watcher)",
		options: []
	},
	handler: commandName
};
