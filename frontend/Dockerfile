FROM node:18.10-alpine

ARG POETICMETRIC_STAGE
ARG SENTRY_AUTH_TOKEN
ENV POETICMETRIC_STAGE=$POETICMETRIC_STAGE
ENV SENTRY_AUTH_TOKEN=$SENTRY_AUTH_TOKEN

WORKDIR /poeticmetric-frontend-builder

# copy only package definition files
COPY package.json package.json
COPY yarn.lock yarn.lock

# install modules
RUN yarn install

# copy the rest of the files
COPY @types @types
COPY components components
COPY contexts contexts
COPY helpers helpers
COPY hooks hooks
COPY lib lib
COPY pageComponents pageComponents
COPY pages pages
COPY public public
COPY styles styles
COPY .env.$POETICMETRIC_STAGE .env
COPY .eslintrc.js .eslintrc.js
COPY .stylelintrc.js .stylelintrc.js
COPY next.config.js next.config.js
COPY tsconfig.json tsconfig.json

# build and export
RUN yarn build
RUN yarn export

FROM nginx:1.23-alpine

RUN apk update && apk add bash

WORKDIR /poeticmetric-frontend

COPY --from=0 /poeticmetric-frontend-builder/out /usr/share/nginx/html
COPY etc/nginx.nginx /etc/nginx/conf.d/default.conf

EXPOSE 80
