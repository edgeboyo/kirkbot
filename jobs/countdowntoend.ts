import * as Discord from "discord.js";
import { scheduleJob } from "node-schedule";
import { fromURL, FullCalendar, CalendarComponent } from "ical";
// ICal feed URL, see https://timetable.soton.ac.uk/Feed/Get to get this
import { icalURL } from "../auth.json";

let calendar: FullCalendar | null = null;

let messages: ((time: number) => string)[] = [
	t => `Only ${t} minute${t == 1 ? "" : "s"} left of Foundations!`,
	t => `${t} minute${t == 1 ? "" : "s"} until your suffering ends`
];

export default {
	setup: async function(client: Discord.Client) {
		try {
			calendar = await new Promise<FullCalendar>((resolve, reject) =>
				fromURL(icalURL, {}, (e, cal) => {
					if (e != null) {
						reject(e);
						return;
					}
					resolve(cal);
				})
			);
		} catch (e) {
			console.log("Failed to obtain calendar: " + e);
		}
	},
	ready: async function(client: Discord.Client) {
		type RequireOne<K extends keyof T, T> = Required<Pick<T, K>> & T;

		// Run at 35 minutes past every hour
		scheduleJob("35 * * * *", () => {
			if (calendar != null) {
				const currDate = new Date();
				if (
					(Object.values(calendar)
						.filter(event => (event.start == undefined ? false : currDate > event.start))
						// The typecasting is done as we know that end is a Date, not Date | undefined, so it doesn't need to be rechecked
						.filter(event => (event.end == undefined ? false : currDate < event.end)) as RequireOne<
						"end",
						CalendarComponent
					>[])
						// Ensure the event is going to end in the next hour (rules out 1st hour of 2 hour lectures)
						.filter(event => event.end.getHours() - 1 == currDate.getHours())
						.filter(event => event.summary?.includes("Foundations")).length > 0
				) {
					let channels = Array.from(client.guilds.values())
						.map(g => g.channels.find(channel => channel.name == "general" && channel.type == "text"))
						.filter(c => c !== undefined) as Discord.TextChannel[];
					// Set timeouts for the next 9 minutes (including now) to send messages
					for (let i = 0; i < 10; i++) {
						// Run 1 in 4 times
						if (Math.random() * 4 <= 1) {
							setTimeout(
								() =>
									// Select a random message
									channels.forEach(c =>
										c.send(messages[Math.floor(Math.random() * messages.length)](10 - i))
									),
								i * 1000 * 60
							);
						}
					}
				}
			}
		});
	}
};
