import * as Discord from "discord.js";

// Add new jobs to this file, started when the client is ready

import join from "./join";
import activity from "./activity";
import kirkOClock from "./kirkoclock";
import countdownToEnd from "./countdowntoend";
import audio from "./audio";

const jobs: { setup?: (client: Discord.Client) => Promise<void>; ready?: (client: Discord.Client) => void }[] = [
	join,
	activity,
	kirkOClock,
	countdownToEnd,
	audio
];

export async function setupJobs(client: Discord.Client): Promise<void> {
	jobs.forEach(job => {
		job.setup?.(client);
	});
}

export async function readyJobs(client: Discord.Client): Promise<void> {
	jobs.forEach(job => {
		job.ready?.(client);
	});
}
