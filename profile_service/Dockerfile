FROM node


WORKDIR /usr/src/app
RUN mkdir /root/.aws/
COPY credentials /root/.aws/
COPY package*.json ./
COPY . .

RUN npm install --production

EXPOSE 8080
CMD ["node", "server.js"]
