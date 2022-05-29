import { Client, CommandInteraction } from "discord.js";

async function commandName(client: Client, interaction: CommandInteraction) {
	// do a thing
	// return will not be used
}

export default {
	commandData: {
		name: "movewatch",
		description: "Move the watcher from one message to another (even between channels)",
		options: []
	},
	handler: commandName
};
