FROM node:12
WORKDIR /usr/src/elciess-signup
COPY ./package.json .
RUN npm install --only=prod