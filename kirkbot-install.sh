#!/bin/sh
cp kirkbot.service /etc/systemd/system
service kirkbot start
systemctl enable kirkbot