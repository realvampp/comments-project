FROM node

WORKDIR /app

COPY package*.json /app

RUN npm install

COPY . .

EXPOSE 3000

CMD npm run migration:run && npm run start