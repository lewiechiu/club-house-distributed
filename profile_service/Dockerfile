FROM node:alpine AS build_image


WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --production

COPY . .

FROM node:alpine

WORKDIR /usr/src/app
COPY --from=build_image /usr/src/app ./
RUN mkdir /root/.aws/
COPY credentials /root/.aws/

EXPOSE 8080
CMD ["node", "server.js"]
