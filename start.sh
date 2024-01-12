forever start --uid "dou-server" -a /home/server/dou-server/dist/index.js

forever restart dou-server

forever stop dou-server

tail -n 15 -f /root/.forever/dou-server.log
