import * as Discord from "discord.js";

export default async function(message: Discord.Message, client: Discord.Client, args: string[]) {
	// This command must be limited to mods and admins. In this example we just hardcode the role names.
	// Please read on Array.some() to understand this bit:
	// https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/some?
	// TODO: should this be hasPermission("ADMINISTRATOR")? or check for thicc guru?
	if (!message.member.hasPermission("ADMINISTRATOR")) {
		message.reply("Sorry, you don't have permissions to use this!");
		return;
	}

	// Let's first check if we have a member and if we can kick them!
	// message.mentions.members is a collection of people that have been mentioned, as GuildMembers.
	// We can also support getting the member by ID, which would be args[0]
	let member = message.mentions.members.first() || message.guild.members.get(args[0]);
	if (!member) {
		message.reply("Please mention a valid member of this server");
		return;
	}
	if (!member.kickable) {
		message.reply("I cannot kick this user! Do they have a higher role? Do I have kick permissions?");
		return;
	}

	// slice(1) removes the first part, which here should be the user mention or ID
	// join(' ') takes all the various parts to make it a single string.
	let reason = args.slice(1).join(" ");
	if (!reason) reason = "No reason provided";

	// Now, time for a swift kick in the nuts!
	await member
		.kick(reason)
		.catch(error => message.reply(`Sorry ${message.author} I couldn't kick because of: ${error}`));
	message.reply(`${member.user.tag} has been kicked by ${message.author.tag} because: ${reason}`);
}
