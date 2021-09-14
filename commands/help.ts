import * as Discord from "discord.js";

function getRandomInt(max: number): number {
	return Math.floor(Math.random() * Math.floor(max));
}

export default async function(message: Discord.Message, client: Discord.Client, args: string[]) {
	const whoAmI: string[] = ["God", "lecturer"];
	var chance: number = getRandomInt(whoAmI.length);
	const helloMessage: string =
		"Hello I'm KirkBot but you might know me as your " +
		whoAmI[chance] +
		`
									I'm a ChatSoc bot, that's here to help you with anything.
									Aside from moderating and organising stuff I also have a few commands that you might want to use!
									Here's the list:
										* !help - I think you already know what this one does :blush:
										* !kirk <text> - use this to make me say ***ANYTHING*** <:bicc_kirk:631859177286795324>
										* !ping - see delay information
										* !listall - list of all servers
										* !purge <number> - I'll remove as many messages as you want :file_cabinet:
										* !kick, !ban - :wink:
									But my devs are working hard to bring you more.
									If you want to see how I work here's a link:
									https://github.com/edgeboyo/kirkbot/
									If you want to add me to your sever go to:
									http://kirkbot.tk/
									Have fun and get ready for a lecture :sunglasses:
	`
			.replace(/\t/g, "")
			.replace(/\n\*/g, "\n	*");
	await message.author.send(helloMessage);
}
