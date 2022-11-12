FROM node:16.17

WORKDIR /app

COPY package*.json ./
RUN npm ci
COPY . ./

CMD ["npm", "start"]
