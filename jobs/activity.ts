import * as Discord from "discord.js";

let getActivity = (client: Discord.Client) => `!help to get some info`;

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
