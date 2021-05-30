FROM node:buster

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
COPY . .

EXPOSE 8080
RUN mkdir /root/.aws/
COPY credentials /root/.aws/
CMD ["nodemon", "-L", "server.js"]
