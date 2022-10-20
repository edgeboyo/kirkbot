import * as Discord from "discord.js";

// Add new jobs to this file, started when the client is ready

import join from "./join";
import activity from "./activity";
import watch from "./watch";

const jobs: { setup?: (client: Discord.Client) => Promise<void>; ready?: (client: Discord.Client) => void }[] = [
	join,
	activity,
	watch
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
