import { Client, CommandInteraction, GuildMember, User } from "discord.js";

function getRandomInt(max: number): number {
	return Math.floor(Math.random() * Math.floor(max));
}

async function commandName(client: Client, interaction: CommandInteraction) {
	const whoAmI: string[] = ["God", "lecturer"];
	var chance: number = getRandomInt(whoAmI.length);

	const member = interaction.member;

	if (!member || !(member instanceof GuildMember)) {
		await interaction.reply({ content: "Could not fetch your user profile", ephemeral: true });
		return;
	}

	const helloMessage: string = `Hello I'm KirkBot but you might know me as your ${whoAmI[chance]}
									I'm a ChatSoc bot, that's here to help you with anything.
									Aside from moderating and organising stuff I also have a few commands that you might want to use!
									Here's the list:
										* !help - I think you already know what this one does :blush:
										* !kirk <text> - use this to make me say ***ANYTHING*** <:bicc_kirk:631859177286795324>
										* !ping - see delay information
										* !pingu - see a nice birb
									But my devs are working hard to bring you more.
									If you want to see how I work here's a link:
									https://github.com/edgeboyo/kirkbot/
									Have fun and get ready for a lecture :sunglasses:
	`
		.replace(/\t/g, "")
		.replace(/\n\*/g, "\n\t*");
	const adminMessage: string = `Oh, I see you're an admin! Let me help you out with a few extra commands
										* !watch <messageId> - make me watch in on reactions to this message :eyes: 
										* !watch - view watchers, their rules, their ids, locations and properties
										* !watchrule <watcherId> <emoji> <roleId> - when I see that *emoji* used, I'll assign this *role* to the reactor :pen_ballpoint:
										* !unwatchrule <watcherId> <ruleId> - remove a rule from a watcher
										* !movewatch <watcherId> <messageId> - move a watcher from a message to another one. With all the emojis :smile: 
										* !endofwatch <watcherId> - remove wa watcher and all its rules
										* !purge <number> - I'll remove as many messages as you want :file_cabinet:
										* !purge <messageId> - I'll remove all messaged that were created after this one :newspaper:
										* !kick, !ban - :wink:
`
		.replace(/\t/g, "")
		.replace(/\n\*/g, "\n\t*");
	await member.send(helloMessage);
	if (member !== null && interaction.memberPermissions?.has("ADMINISTRATOR")) {
		await member.send(adminMessage);
	}

	await interaction.reply({ content: "Check your DMs!", ephemeral: true });
}

export default {
	commandData: { name: "help", description: "Get a DM with some pointers of how to use KirkBot", options: [] },
	handler: commandName
};
