#!/bin/sh
git fetch --all
git reset --hard origin/master
git pull
npm install
npm run build
npm start
exit $?
