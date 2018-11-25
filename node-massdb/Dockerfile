FROM node:10

RUN apt-get update && apt-get install -y git 

EXPOSE 80

WORKDIR /git

COPY src /node-massdb
COPY config.json /node-massdb

WORKDIR /node-massdb
RUN npm i --production && rm -rf /root/.npm /usr/local/share/.cache /root/.cache

CMD npm run server

