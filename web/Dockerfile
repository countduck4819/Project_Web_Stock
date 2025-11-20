FROM node:22.9.0

WORKDIR /fireant/web

COPY package*.json ./
RUN npm install

COPY . .

CMD ["npm", "run", "dev"]
