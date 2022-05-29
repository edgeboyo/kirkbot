import { Client, CommandInteraction, GuildMember } from "discord.js";

async function ban(client: Client, interaction: CommandInteraction) {
	// Most of this command is identical to kick, except that here we'll only let admins do it.
	// In the real world mods could ban too, but this is just an example, right? ;)
	// TODO: should this be hasPermission("ADMINISTRATOR")? or check for thicc guru?
	if (interaction.member == null || interaction.guild == null) return;
	if (!interaction.memberPermissions?.has("ADMINISTRATOR")) {
		interaction.reply("Sorry, you don't have permissions to use this!");
		return;
	}

	let member = interaction.options.getMember("who");

	if (!member) {
		interaction.reply("Please mention a valid member of this server");
		return;
	}

	if (!(member instanceof GuildMember)) {
		interaction.reply("I don't know how do deal with API Data...");
		return;
	}

	if (!member.bannable) {
		interaction.reply("I cannot ban this user! Do they have a higher role? Do I have ban permissions?");
		return;
	}

	let reason = interaction.options.getString("reason");
	if (!reason) reason = "No reason provided";

	await member
		.ban({ reason: reason })
		.catch(error => interaction.reply(`Sorry ${interaction.member} I couldn't ban because of: ${error}`));
	interaction.reply(`${member.user.tag} has been banned by ${interaction.member} because: ${reason}`);
}

export default {
	commandData: {
		name: "ban",
		description: "Ban a very annoying gamer",
		options: [
			{ name: "who", type: "USER", description: "The user you'll be banning", required: true },
			{ name: "reason", type: "STRING", description: "The reason for the ban" }
		]
	},
	handler: ban
};
