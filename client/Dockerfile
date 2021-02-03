FROM node:alpine

WORKDIR /app
COPY package.json .
COPY . .
RUN apk --no-cache --update --virtual build-dependencies add \
    tzdata \
    build-base python
RUN npm install -g node-gyp
RUN npm install --only=prod
RUN npm run build
COPY . .

CMD ["npm", "run", "deploy"]