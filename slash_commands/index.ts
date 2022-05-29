// To add a command add it in this format:
//      - name - command's callable name
//      - description - description of the commands
//      - handler - function that handles the command with client and interaction as variables

import { ApplicationCommandOptionData, Client, CommandInteraction } from "discord.js";

import ping from "./ping";
import pingu from "./pingu";
import kick from "./kick";
import ban from "./ban";
import { CommandDescriptor } from "./CommandDescriptor";

const commands: CommandDescriptor[] = [ping, pingu, kick, ban];

class ValidationError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "ValidationError";
	}
}

export function validateCommands() {
	const uniqueNames: string[] = [];

	const verificationReturn = commands.every(command => {
		const {
			commandData: { name },
			handler
		} = command;

		if (!(typeof name === "string")) {
			throw new ValidationError(`${name} is not a string. Is ${typeof name} instead`);
		}

		if (uniqueNames.includes(name)) {
			throw new ValidationError(`${name} was used in a command before. Command names need to be unique`);
		}

		// if (!(typeof description === "string")) {
		// 	throw new ValidationError(
		// 		`In command ${name} - ${description} is not a string. Is ${typeof description} instead`
		// 	);
		// }

		if (!(typeof handler === "function")) {
			throw new ValidationError(
				`In command ${name} - The handler field needs to be a Function with client and interaction fields. Is ${typeof handler} instead`
			);
		}

		uniqueNames.push(name);

		return true;
	});

	if (!verificationReturn) {
		throw new ValidationError("Some unspecified error happened...");
	}
}

function setCommands(client: Client, commands: CommandDescriptor[]) {
	const strippedCommands = commands.map(({ commandData }) => commandData);

	console.log(strippedCommands);

	client.application?.commands.set(strippedCommands);
}

export function setupCommands(client: Client) {
	setCommands(client, commands);

	client.on("interactionCreate", async interaction => {
		if (!interaction.isCommand()) return;

		const { commandName } = interaction;

		const command = commands.find(({ commandData: { name } }) => name == commandName);

		if (command == undefined) {
			await interaction.reply(
				"No command handler for this command provided. You might have to wait for the API to refresh."
			);
			return;
		}

		command.handler(client, interaction);
	});
}