import * as Discord from "discord.js";

export default async function(message: Discord.Message, client: Discord.Client, args: string[]) {
	// Most of this command is identical to kick, except that here we'll only let admins do it.
	// In the real world mods could ban too, but this is just an example, right? ;)
	// TODO: should this be hasPermission("ADMINISTRATOR")? or check for thicc guru?
	if (!message.member.hasPermission("ADMINISTRATOR")) {
		message.reply("Sorry, you don't have permissions to use this!");
		return;
	}

	let member = message.mentions.members.first();
	if (!member) {
		message.reply("Please mention a valid member of this server");
		return;
	}
	if (!member.bannable) {
		message.reply("I cannot ban this user! Do they have a higher role? Do I have ban permissions?");
		return;
	}

	let reason = args.slice(1).join(" ");
	if (!reason) reason = "No reason provided";

	await member
		.ban(reason)
		.catch(error => message.reply(`Sorry ${message.author} I couldn't ban because of: ${error}`));
	message.reply(`${member.user.tag} has been banned by ${message.author.tag} because: ${reason}`);
}
