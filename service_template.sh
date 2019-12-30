echo "[Unit]
Description=Kirkbot (ChatSoc Discord bot)
After=network.target

[Service]
ExecStart=$(pwd)/kirkbot.sh
WorkingDirectory=$(pwd)/
Restart=on-failure
User=$(whoami)

[Install]
WantedBy=multi-user.target"
