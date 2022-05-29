import { ApplicationCommandData, Client, CommandInteraction } from "discord.js";

export type CommandDescriptor = {
	commandData: ApplicationCommandData;
	handler: (client: Client, interaction: CommandInteraction) => Promise<void>;
};
