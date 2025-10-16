FROM node

RUN mkdir /configspace

VOLUME /configspace

ADD build/* .

ADD package.json .

ADD package-lock.json .

ADD sample_auth.json /configspace/auth.json

RUN npm i

ENV CONFIG_PATH=/configspace

CMD ["bash", "-c", "CONFIG_PATH=$CONFIG_PATH npm run start-docker"]