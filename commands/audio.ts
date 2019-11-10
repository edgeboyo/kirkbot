import * as Discord from "discord.js";
import audio from "../jobs/audio";

export default async function(message: Discord.Message, client: Discord.Client, args: string[]) {
	if (
		message.member.hasPermission("ADMINISTRATOR") &&
		(message.guild.id == "629265673666822144" || message.guild.id == "634026138527596554")
	) {
		if (args.length != 2) {
			await message.channel.send(
				"Available subcommands: play [url], add [url], remove [url]\n" +
					"Add/remove will play the set URLs randomly, play will play it immediately"
			);
			return;
		}

		switch (args[0]) {
			case "play":
				if (message.member.voiceChannel == null) {
					await message.channel.send("Must be in a voice channel!");
					return;
				}
				await message.channel.send("Playing...");
				try {
					await audio.playAudio(args[1], message.member);
				} catch (e) {
					await message.channel.send("Failed to play audio: " + e);
				}
				break;
			case "add":
				try {
					await audio.addAudio(args[1], message.member.guild.id);
				} catch (e) {
					await message.channel.send("Failed to add audio: " + e);
					return;
				}
				await message.channel.send("Added URL!");
				break;
			case "remove":
				let removed = false;
				try {
					removed = await audio.removeAudio(args[1], message.member.guild);
				} catch (e) {
					await message.channel.send("Failed to add audio: " + e);
					return;
				}
				if (removed) {
					await message.channel.send("Removed URL!");
				} else {
					await message.channel.send("URL does not exist!");
				}
				break;
			default:
				await message.channel.send("Available subcommands: play [url], add [url], remove [url]");
		}
	} else {
		await message.channel.send("You can't do that. It's illegal!");
	}
}
