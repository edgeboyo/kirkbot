import * as Discord from "discord.js";
import { readFile, writeFile } from "fs";
import { promisify } from "util";
import request from "request-promise-native";
import { createReadStream } from "fs";
import { opus } from "prism-media";
import { ReadableStreamBuffer } from "stream-buffers";

let audioConfig: { [guild: string]: string[] } = {};
let audioCached: { [url: string]: Buffer } = {};
let cachedConns: { [id: string]: Discord.VoiceConnection } = {};

const updateConnections = async (client: Discord.Client) => {
	let allGuilds = Array.from(client.guilds.values());
	await Promise.all(
		allGuilds.map(async guild => {
			// if (audioConfig[guild.id] == undefined || audioConfig[guild.id].length == 0) {
			// 	return;
			// }

			let chans = guild.channels.filter(channel => channel.type == "voice") as Discord.Collection<
				Discord.Snowflake,
				Discord.VoiceChannel
			>;
			await Promise.all(
				chans.map(async chan => {
					let conn = cachedConns[chan.id];
					if (chan.members.size > 0 && conn == undefined) {
						conn = await chan.join();
						cachedConns[chan.id] = conn;
					} else if (chan.members.size <= 1) {
						conn?.disconnect();
						delete cachedConns[chan.id];
					}
				})
			);
		})
	);
};

const manualJoin = async (chan: Discord.VoiceChannel) => {
	let conn = cachedConns[chan.id];
	if (conn == undefined) {
		cachedConns[chan.id] = await chan.join();
		conn = cachedConns[chan.id];
	}
	return conn;
};

const manualLeave = async (chan: Discord.VoiceChannel) => {
	// This is handled by updateConnections, for now
	// if (audioConfig[chan.guild.id] != undefined && audioConfig[chan.guild.id].length > 0) {
	// 	return;
	// }
	// cachedConns[chan.id]?.disconnect();
	// delete cachedConns[chan.id];
};

export default {
	setup: async function(client: Discord.Client) {
		try {
			let conf = await promisify(readFile)("audio_config.json", { encoding: "utf8" });
			audioConfig = JSON.parse(conf);
		} catch {
			audioConfig = {};
		}

		let urlList: string[] = [];
		Object.keys(audioConfig).forEach(guild => {
			audioConfig[guild].forEach(url => {
				urlList.push(url);
			});
		});
		// Filter the url list to remove duplicates
		urlList.filter((e, i) => urlList.indexOf(e) === i);
		// Request all urls from all guilds
		await Promise.all(
			urlList.map(async url => {
				if (audioCached[url] == undefined) {
					try {
						audioCached[url] = await request(url, { encoding: null });
					} catch {
						delete audioCached[url];
					}
				}
			})
		);
	},
	ready: async function(client: Discord.Client) {
		updateConnections(client);

		client.on("voiceStateUpdate", () => updateConnections(client));

		setInterval(() => {
			Object.values(cachedConns).forEach(conn => {
				// TODO: tweak interval and chance

				if (audioConfig[conn.channel.guild.id] == undefined || audioConfig[conn.channel.guild.id].length == 0) {
					return;
				}
				let url =
					audioConfig[conn.channel.guild.id][
						Math.floor(Math.random() * audioConfig[conn.channel.guild.id].length)
					];

				let stream = new ReadableStreamBuffer();
				stream.put(audioCached[url]);
				conn?.playOpusStream(stream.pipe(new opus.OggDemuxer()));
			});
		}, 5000);
	},
	addAudio: async function(url: string, guildId: Discord.Snowflake) {
		if (audioCached[url] == undefined) {
			try {
				audioCached[url] = await request(url, { encoding: null });
			} catch {
				delete audioCached[url];
				return;
			}
		}
		if (audioConfig[guildId] != undefined) {
			if (audioConfig[guildId].indexOf(url) < 0) {
				audioConfig[guildId].push(url);
			}
		} else {
			audioConfig[guildId] = [url];
		}
		await promisify(writeFile)("audio_config.json", JSON.stringify(audioConfig));
	},
	removeAudio: async function(url: string, guild: Discord.Guild) {
		let removed = false;
		if (audioConfig[guild.id] != undefined) {
			let i = audioConfig[guild.id].indexOf(url);
			if (i > -1) {
				audioConfig[guild.id].splice(i, 1);
				removed = true;
			}
			// Ensure channels are disconnected from
			if (audioCached[guild.id]?.length == 0) {
				let chans = guild.channels.filter(channel => channel.type == "voice") as Discord.Collection<
					Discord.Snowflake,
					Discord.VoiceChannel
				>;
				await Promise.all(
					chans.map(async chan => {
						let conn = cachedConns[chan.id];
						if (chan.members.size <= 1 && conn != undefined) {
							conn.disconnect();
							delete cachedConns[chan.id];
						}
					})
				);
			}
		}
		if (removed) {
			await promisify(writeFile)("audio_config.json", JSON.stringify(audioConfig));
			return true;
		}
		return false;
	},
	playAudio: async function(url: string, member: Discord.GuildMember) {
		if (audioCached[url] == undefined) {
			try {
				audioCached[url] = await request(url, { encoding: null });
			} catch (e) {
				delete audioCached[url];
				throw e;
			}
		}
		if (member.voiceChannel == null) return;
		let chan = member.voiceChannel;
		let conn = await manualJoin(chan);

		let stream = new ReadableStreamBuffer();
		stream.put(audioCached[url]);
		conn?.playOpusStream(stream.pipe(new opus.OggDemuxer())).on("end", () => {
			manualLeave(chan);
		});
	}
};
