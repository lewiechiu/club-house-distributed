FROM node:alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --production --legacy-peer-deps

COPY . .

EXPOSE 3000

CMD ["npm", "start"]