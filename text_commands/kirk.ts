import * as Discord from "discord.js";

export default async function(message: Discord.Message, client: Discord.Client, args: string[]) {
	if (message.member == null || message.guild == null) return;
	// makes the bot say something and delete the message. As an example, it's open to anyone to use.
	// To get the "message" itself we join the `args` back into a string with spaces:
	const sayMessage = args.join(" ");
	if (
		(sayMessage.includes("@everyone") || sayMessage.includes("@here")) &&
		!message.member.permissions.has("ADMINISTRATOR")
	) {
		message.delete().catch(O_o => {});
		return;
	}

	const files = message.attachments != null ? Object.values(message.attachments) : [];

	message.delete().catch(O_o => {});

	message.channel.send({ content: sayMessage, files });
}
