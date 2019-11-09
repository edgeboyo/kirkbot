import * as Discord from "discord.js";
import { scheduleJob } from "node-schedule";
import request from "request-promise-native";

enum LectureType {
	None,
	Kirk = "Kirk",
	Andy = "Krik"
}

const fillArray = (obj: { [week: number]: LectureType }) => {
	let res: LectureType[] = [];
	let greatestWeek = 0;
	Object.keys(obj).forEach(week => {
		if ((Number(week) ?? 0) > greatestWeek) {
			greatestWeek = Number(week);
		}
	});
	for (let i = 0; i < greatestWeek + 1; i++) {
		res[i] = obj[i] ?? LectureType.None;
	}
	return res;
};

const schedule: { [spec: string]: LectureType[] } = {
	// 3pm Monday
	"0 15 * * 1": fillArray({
		6: LectureType.Andy,
		7: LectureType.Andy,
		8: LectureType.Kirk,
		9: LectureType.Kirk,
		10: LectureType.Kirk,
		12: LectureType.Kirk
	}),
	// 3pm Tuesday
	"0 15 * * 2": fillArray({
		6: LectureType.Andy,
		// GB?!
		7: LectureType.None,
		8: LectureType.Kirk,
		// Not labelled?!
		9: LectureType.None,
		// Not labelled?!
		10: LectureType.None
	}),
	// 5pm Friday
	"0 17 * * 5": fillArray({
		6: LectureType.Kirk,
		7: LectureType.Andy,
		8: LectureType.Kirk,
		9: LectureType.Andy,
		12: LectureType.Andy
	})
};

export default {
	ready: async function(client: Discord.Client) {
		let channels = Array.from(client.guilds.values())
			.map(g => g.channels.find(channel => channel.name == "general" && channel.type == "text"))
			.filter(c => c !== undefined) as Discord.TextChannel[];

		const requestWeek = async () => {
			let response: {
				week: { week: number };
				term: { start: number; end: number; term: string };
				semester: { start: number; end: number; semester: number };
			} = await request({
				url: "http://whatweekisit.southampton.ac.uk/today.json",
				json: true
			});

			return response?.week?.week;
		};

		Object.keys(schedule).forEach(spec => {
			scheduleJob(spec, async () => {
				let currWeek: number;
				try {
					currWeek = await requestWeek();
					if (currWeek == undefined) throw "Current week is undefined!";
				} catch (e) {
					console.error("Failed to request week: " + e);
					return;
				}
				console.log("Kirk O'Clock triggered:", "week", currWeek);
				if (currWeek < schedule[spec].length) {
					console.log("Lecture type:", schedule[spec][currWeek]);
					if (currWeek < schedule[spec].length && schedule[spec][currWeek] != LectureType.None) {
						channels.forEach(c => c.send(`It's ${schedule[spec][currWeek]} O'Clock!`));
					}
				}
			});
		});
	}
};
