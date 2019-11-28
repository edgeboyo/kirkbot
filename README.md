# KirkBot

Kirkbot is a bot created for the Southhampton University Chat Society

## Usage of already running bot

Go to:
http://kirkbot.tk/
to add him to your server

## Using your own instance of KirkBot

After cloning/pulling the repository use the command

`npm install`
(not **necessary** after the first time, but **highly** encouraged)

`npm run build`

`npm start`

or if using Linux simply run
`./kirkbot.sh`

### Setting up the kirkbot service

To set up KirkBot as a systemd service you need to modify the kirkbot.service file accordingly:

* change `ExecStart=/home/kirkbot/kirkbot.sh` to point to the kirkbot.sh file
* change `WorkingDirectory=/home/kirkbot/` to point to the directory where file is located
* change `User=kirkbot` to the in-system owner of the working directory

Afterwards run `sudo ./kirkbot-install.sh`

## Feature list

## Commands

* help - displays all messages to the DMs of the sender
* listall - displays a list of all servers with KirkBot
* kirk <text> - make the bot say something (@everyone is blocked for non-admins)
* ping - show API information and responce time
* purge <number> - remove multiple messages at one time
* kick <user> - kicks user (only admins can use this)
* ban <user> - bans user (only admins can use this)
