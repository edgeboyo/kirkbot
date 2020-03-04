import * as Discord from "discord.js";

export default async function(message: Discord.Message, client: Discord.Client, args: string[]) {
	// makes the bot say something and delete the message. As an example, it's open to anyone to use.
	// To get the "message" itself we join the `args` back into a string with spaces:

	const ch = message.channel;

	if(!((ch): ch is Discord.TextChannel => ch.type === 'text')(ch)) return;

	let wh = await ch.createWebhook(message.author.username, message.author.displayAvatarURL);
	
	if(wh.token == null)return;

	const cli = new Discord.WebhookClient(wh.id, wh.token);

	cli.send("Yes, it is I!");

	wh.delete();
}