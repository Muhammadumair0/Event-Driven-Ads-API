FROM node:18-alpine

WORKDIR /code

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8000

CMD ["npm", "start"]
