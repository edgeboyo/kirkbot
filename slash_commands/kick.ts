import { Client, CommandInteraction, GuildMember } from "discord.js";

async function kick(client: Client, interaction: CommandInteraction) {
	if (interaction.member == null || interaction.memberPermissions == null || interaction.guild == null) return;
	// This command must be limited to mods and admins. In this example we just hardcode the role names.
	// Please read on Array.some() to understand this bit:
	// https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/some?
	// TODO: should this be hasPermission("ADMINISTRATOR")? or check for thicc guru?
	if (!interaction.memberPermissions.has("ADMINISTRATOR")) {
		interaction.reply("Sorry, you don't have permissions to use this!");
		return;
	}

	// Let's first check if we have a member and if we can kick them!
	// message.mentions.members is a collection of people that have been mentioned, as GuildMembers.
	// We can also support getting the member by ID, which would be args[0]
	let member = interaction.options.getMember("who");
	if (!member) {
		interaction.reply("Please mention a valid member of this server");
		return;
	}

	if (!(member instanceof GuildMember)) {
		interaction.reply("I don't know how do deal with API Data...");
		return;
	}

	if (!member.kickable) {
		interaction.reply("I cannot kick this user! Do they have a higher role? Do I have kick permissions?");
		return;
	}

	// slice(1) removes the first part, which here should be the user mention or ID
	// join(' ') takes all the various parts to make it a single string.
	let reason = interaction.options.getString("reason");
	if (!reason) reason = "No reason provided";

	// Now, time for a swift kick in the nuts!
	await member
		.kick(reason)
		.catch(error => interaction.reply(`Sorry ${interaction.member} I couldn't kick because of: ${error}`));
	interaction.reply(`${member.user.tag} has been kicked by ${interaction.member} because: ${reason}`);
}

export default {
	commandData: {
		name: "kick",
		description: "Kick a naughty member of the public",
		options: [
			{ name: "who", type: "USER", description: "The user you'll be kicking", required: true },
			{ name: "reason", type: "STRING", description: "The reason for the kicking" }
		]
	},
	handler: kick
};
