FROM node:12.16.1-alpine

WORKDIR "/app"

COPY package.json .

RUN npm install

COPY . .

RUN ["npm", "install", "--prefix", "./client"]

RUN ["npm", "run", "build", "--prefix", "./client"]

CMD [ "node", "server.js"]