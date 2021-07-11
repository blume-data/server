FROM node:alpine

WORKDIR /app
COPY package.json .
COPY . .
RUN npm install --only=prod
RUN npm run build:prod
COPY . .

CMD ["npm", "run", "deploy"]