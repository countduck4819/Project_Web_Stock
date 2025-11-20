FROM node:22.9.0

WORKDIR /fireant/api

COPY package*.json ./
RUN npm install

COPY . .

CMD ["npm", "run", "start:dev"]
