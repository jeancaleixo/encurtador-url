FROM node:22.14

ENV LANG=C.UTF-8

WORKDIR /encurtador-url

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

CMD ["npm", "run", "start:prod"]