FROM node:8.4.0-alpine

WORKDIR /user/src/app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 8000

CMD ["npm", "start"]
