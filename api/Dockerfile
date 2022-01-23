FROM node:14

WORKDIR /app
COPY package.json .
RUN npm install --only=prod
COPY . .
RUN npm run build
COPY . .
CMD ["npm","run", "start"]