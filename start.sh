forever start --uid "dou" -a /home/server/dou-server/dist/index.js

forever restart dou

forever stop dou

tail -n 15 -f /root/.forever/dou.log
