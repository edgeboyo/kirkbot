import { Client, CommandInteraction, Message, TextChannel, ThreadChannel } from "discord.js";

async function purge(client: Client, interaction: CommandInteraction) {
	// This command removes all messages from all users in the channel, up to 100.
	if (interaction.member == null || interaction.guild == null) return;

	if (interaction.memberPermissions?.has("ADMINISTRATOR")) {
		const amount = interaction.options.getInteger("amount");
		const after = interaction.options.getString("after");

		var toDelete;
		const channel = interaction.channel;

		if (!(channel instanceof TextChannel) && !(channel instanceof ThreadChannel)) {
			interaction.reply({ content: "Could not interact with this channel correctly...", ephemeral: true });
			return;
		}

		if (amount && after) {
			interaction.reply({
				content: "You can't set amount and after arguments at the same time",
				ephemeral: true
			});
			return;
		}
		//use the number as a message limit
		else if (after) {
			toDelete = await channel.messages.fetch({ after });
		} else if (amount) {
			// Ooooh nice, combined conditions. <3
			if (!amount || amount < 2 || amount > 100) {
				interaction.reply({
					content: "Please provide a number between 2 and 100 for the number of messages to delete",
					ephemeral: true
				});
				return;
			}

			toDelete = await channel.messages.fetch({
				limit: amount
			});
		} else {
			interaction.reply({
				content: "You neet to set the amount or the after arguments",
				ephemeral: true
			});
			return;
		}

		await interaction.reply(`Deleting ${toDelete.size} messages...`);

		const deleted = await channel.bulkDelete(toDelete, true);

		const deletedArray = Array.from(deleted.values()).map((mes: Message) => {
			return mes.id;
		});

		const remaining = Array.from(toDelete.values()).filter((mes: Message) => {
			return !deletedArray.includes(mes.id);
		});

		await Promise.all(
			remaining.map(async mes => {
				await channel.messages.delete(mes);
			})
		);

		await interaction.editReply(`Messages deleted... This will disappear in 10 seconds...`);

		setTimeout(() => interaction.deleteReply(), 10000);
	} else {
		interaction.reply({ content: "Sorry, you don't have permissions to use this!", ephemeral: true });
		return;
	}
}

export default {
	commandData: {
		name: "purge",
		description: "Remove a large amount of messages at once",
		options: [
			{
				name: "amount",
				type: "INTEGER",
				description: "Amount of messages to delete prior to this one"
			},
			{
				name: "after",
				type: "STRING",
				description: "ID of the last message that is allowed to remain in this channel"
			}
		]
	},
	handler: purge
};
