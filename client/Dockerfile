FROM node:alpine
WORKDIR /app
COPY package.json .
COPY . .
RUN yarn install --only=prod
RUN yarn build
COPY . .

CMD ["npm", "run", "start"]