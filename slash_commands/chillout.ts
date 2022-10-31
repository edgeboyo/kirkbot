import { Client, CommandInteraction, GuildMember } from "discord.js";

async function chillout(client: Client, interaction: CommandInteraction) {
	// Most of this command is identical to kick, except that here we'll only let admins do it.
	// In the real world mods could ban too, but this is just an example, right? ;)
	// TODO: should this be hasPermission("ADMINISTRATOR")? or check for thicc guru?
	if (interaction.member == null || interaction.guild == null) return;
	if (!interaction.memberPermissions?.has("ADMINISTRATOR")) {
		interaction.reply({ content: "Sorry, you don't have permissions to use this!", ephemeral: true });
		return;
	}

	let member = interaction.options.getMember("who");

	if (!member) {
		interaction.reply({ content: "Please mention a valid member of this server", ephemeral: true });
		return;
	}

	if (!(member instanceof GuildMember)) {
		interaction.reply({ content: "I don't know how do deal with API Data...", ephemeral: true });
		return;
	}

	if (!member.bannable) {
		interaction.reply({
			content: "I cannot timeout this user! Do they have a higher role? Do I have ban permissions?",
			ephemeral: true
		});
		return;
	}

	let howLong = interaction.options.getInteger("how_long");
	if (!howLong) {
		interaction.reply({ content: "Could not fetch length of *chillout*", ephemeral: true });
		return;
	}

	let reason: string | null | undefined = interaction.options.getString("reason");
	if (!reason) reason = undefined;

	const resp = await member.timeout(howLong * 1000, reason).catch(error =>
		interaction.reply({
			content: `Sorry ${interaction.member} I couldn't ban because of: ${error}`,
			ephemeral: true
		})
	);

	if (!resp) {
		return;
	}

	let display = interaction.options.getBoolean("display_setting");

	const message = `${member.user.tag} was asked to take a chill pill for ${optionsToMessage[howLong]} because: ${reason}`;

	if (display) {
		interaction.reply(message);
	} else {
		interaction.reply({ content: message, ephemeral: true });
	}
}

const chilloutTimeOptions = {
	"10 SECONDS": 10,
	"1 MINUTE": 60,
	"10 MINUTES": 60 * 10,
	"1 HOUR": 60 * 60,
	"3 HOURS": 3 * 60 * 60,
	"6 HOURS": 6 * 60 * 60,
	"12 HOURS": 12 * 60 * 60,
	"1 DAY": 24 * 60 * 60
};

const optionsToMessage = Object.fromEntries(
	Object.entries(chilloutTimeOptions).map(([key, val]) => {
		return [val, key];
	})
);

export default {
	commandData: {
		name: "chill_out",
		description: "Ask a user to take a chill pill",
		options: [
			{ name: "who", type: "USER", description: "The user you'll be putting on timeout", required: true },
			{
				name: "how_long",
				type: "INTEGER",
				description: "How long should the chill period be",
				required: true,
				choices: Object.entries(chilloutTimeOptions).map(([name, value]) => {
					return { name, value };
				})
			},
			{ name: "reason", type: "STRING", description: "The reason for the timeout" },
			{
				name: "display_setting",
				type: "BOOLEAN",
				description: "Should a message with the reason be broadcast to all users"
			}
		]
	},
	handler: chillout
};
