FROM node:18

ENV GOOGLE_API_KEY=${GOOGLE_API_KEY}

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 8888

CMD [ "npm", "run", "start" ]