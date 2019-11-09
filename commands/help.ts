import * as Discord from "discord.js";

export default async function(message: Discord.Message, client: Discord.Client, args: string[]) {
	await message.author.send("THIS IS WHERE THE HELP WILL BE SENT");
}
