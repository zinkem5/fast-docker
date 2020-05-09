FROM node as fast_node_modules
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci

FROM fast_node_modules as fast_default_templates
ENV F5_FAST_TEMPLATE_ROOT /var/config/templates/
COPY ./templates/* /var/config/templates/

FROM fast_default_templates as fast-http
COPY index.js ./
CMD node .
