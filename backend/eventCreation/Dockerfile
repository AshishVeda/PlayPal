FROM --platform=linux/amd64 node:16

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3500

CMD ["node", "app.js"]
