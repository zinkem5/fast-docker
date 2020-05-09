FROM node

ENV F5_FAST_TEMPLATE_ROOT /var/config/templates/

COPY ./templates/* /var/config/templates/
WORKDIR /usr/src/app

COPY package*.json ./
COPY index.js ./

RUN npm ci
CMD node .
