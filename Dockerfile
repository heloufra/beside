FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN apk add --no-cache tini

ENTRYPOINT ["/sbin/tini", "--"]

RUN npm ci --omit=dev

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
