FROM node:15.1-alpine
RUN apk add --no-cache g++ make python

WORKDIR /app
COPY package.json .
COPY . .
RUN npm install -g node-gyp
RUN npm install --only=prod
RUN npm run build:prod
COPY . .

CMD ["npm", "run", "deploy"]