import * as Discord from "discord.js";

let getActivity = (client: Discord.Client) =>
	`Serving ${client.guilds.size} server${client.guilds.size == 1 ? "" : "s"}`;

export default {
	setup: async function(client: Discord.Client) {
		client.on("guildCreate", guild => {
			client.user.setActivity(getActivity(client));
		});

		client.on("guildDelete", guild => {
			client.user.setActivity(getActivity(client));
		});
	},
	ready: async function(client: Discord.Client) {
		client.user.setActivity(getActivity(client));
	}
};
