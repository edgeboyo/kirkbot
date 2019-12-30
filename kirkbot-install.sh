#!/bin/sh
if [ ! -f kirkbot.service ]; then
	./service_template.sh > kirkbot.service
fi
cp kirkbot.service /etc/systemd/system
systemctl enable kirkbot
service kirkbot start
