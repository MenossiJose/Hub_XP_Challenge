FROM node:20-alpine

WORKDIR /usr/src/app

COPY . .
COPY .env .env

RUN npm install

RUN npm run build

CMD ["npm", "run", "start:prod"]