import * as Discord from "discord.js";

export default async function(message: Discord.Message, client: Discord.Client, args: string[]) {
	//bot sends picture
	message.channel.send({ files: ["pic/pingu.png"] });
}
