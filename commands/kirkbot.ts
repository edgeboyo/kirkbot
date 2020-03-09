import * as Discord from "discord.js";

export default async function(message: Discord.Message, client: Discord.Client, args: string[]) {
	// makes the bot say something and delete the message. As an example, it's open to anyone to use.
	// To get the "message" itself we join the `args` back into a string with spaces:

	var fs = require("fs");

	const dirName = "configs";
	if (!fs.existsSync(dirName)) {
    	fs.mkdirSync(dirName, 0o744);
	}

	if (args[0] === "init"){
		if(args.length < 2){
			message.channel.send("No channel provided!");
			return;
		}

		var config = {
			"channelID" : args[1],
			"deadlineinfo": []
		};

		var confstr = JSON.stringify(config);

		console.log("Let's go boi!\n\n\n\n");

		var fs = require('fs');

		const fileName : string = "configs/" + message.guild.id + ".json";

		console.log(fileName);

			await fs.writeFile(fileName, confstr, function(err : Object, result : Object) {});
		message.channel.send("Config created for " + message.guild.name);
	}

	else if(args[0] === "add"){
		if(args.length < 2){
			message.channel.send("No new message provided!");
			return;
		}
		var fs = require('fs');

		let rawaf = fs.readFileSync("configs/" + message.guild.id + ".json", function(err : Object, result : Object) {});
		let config = JSON.parse(rawaf);
		config["deadlineinfo"].push(args[1]);

		console.log(config);

		var confstr = JSON.stringify(config);

		

		const fileName : string = "configs/" + message.guild.id + ".json";
		fs.writeFile(fileName, confstr, function(err : Object, result : Object) {});
	}
	/*
	const sayMessage = args.join(" ");
	if (
		(sayMessage.includes("@everyone") || sayMessage.includes("@here")) &&
		!message.member.hasPermission("ADMINISTRATOR")
	) {
		message.delete().catch(O_o => {});
		return;
	}
	// Then we delete the command message (sneaky, right?). The catch just ignores the error with a cute smiley thing.
	message.delete().catch(O_o => {});
	// And we get the bot to say the thing:
	message.channel.send(sayMessage);
	*/
}
