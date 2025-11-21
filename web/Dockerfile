FROM node:22.9.0

WORKDIR /fireant/web

# copy package.json
COPY package*.json ./

RUN npm install

# copy toàn bộ source web
COPY . .

# build
RUN npm run build

CMD ["npm", "run", "start"]