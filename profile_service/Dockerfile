FROM node:alpine

RUN mkdir /root/.aws/
COPY credentials /root/.aws/

WORKDIR /usr/src/app
COPY package.json ./
COPY . .

RUN npm install --production

EXPOSE 8080
ENTRYPOINT [ "node" ]
CMD ["server.js"]
