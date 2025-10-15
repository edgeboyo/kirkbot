FROM node

RUN mkdir /configspace

VOLUME /configspace

RUN npm i

RUN npm run build

ADD build/* .

ADD package.json .

ADD package-lock.json .

ADD config.json.template .

RUN npm i

CMD ["bash", "-c", "npm start"]