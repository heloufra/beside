FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN apk add --no-cache tini

ENTRYPOINT ["/sbin/tini", "--"]

RUN npm install

COPY . .

EXPOSE 3002

CMD ["npm", "start"]
