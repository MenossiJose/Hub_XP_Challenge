FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

ENV PORT=3000
ENV NODE_ENV=production

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]