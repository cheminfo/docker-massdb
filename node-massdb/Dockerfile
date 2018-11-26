FROM node:10

EXPOSE 80

COPY src /node-massdb

WORKDIR /node-massdb
RUN npm i --production && rm -rf /root/.npm /usr/local/share/.cache /root/.cache

CMD npm run server

