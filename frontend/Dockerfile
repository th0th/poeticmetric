FROM node:19.4-alpine

RUN apk update && apk add bash

ARG BASE_URL
ARG HOSTED=false
ARG SENTRY_AUTH_TOKEN
ARG SENTRY_DSN
ARG SENTRY_ORG
ARG SENTRY_PROJECT
ARG SENTRY_URL
ARG STAGE=production

WORKDIR /poeticmetric-frontend-builder

# copy only package definition files
COPY package.json .
COPY yarn.lock .

# install modules
RUN yarn install

# copy the rest of the files
COPY @types @types
COPY blog blog
COPY components components
COPY contexts contexts
COPY docs docs
COPY helpers helpers
COPY hooks hooks
COPY lib lib
COPY pageComponents pageComponents
COPY pages pages
COPY public public
COPY styles styles
COPY .eslintrc.js .
COPY .stylelintrc.js .
COPY next-sitemap.config.js .
COPY next.config.js .
COPY sentry.client.config.js .
COPY sentry.server.config.js .
COPY tsconfig.json .

ENV NEXT_TELEMETRY_DISABLED=1

ENV BASE_URL=${BASE_URL}
ENV HOSTED=${HOSTED}
ENV SENTRY_AUTH_TOKEN=${SENTRY_AUTH_TOKEN}
ENV SENTRY_DSN=${SENTRY_DSN}
ENV SENTRY_ORG=${SENTRY_ORG}
ENV SENTRY_PROJECT=${SENTRY_PROJECT}
ENV SENTRY_URL=${SENTRY_URL}
ENV STAGE=${STAGE}

COPY etc/build.sh .

RUN ./build.sh

FROM nginx:1.23-alpine

RUN apk update && apk add bash

WORKDIR /poeticmetric-frontend

COPY --from=0 /poeticmetric-frontend-builder/out /usr/share/nginx/html
COPY etc/generate-config.sh /docker-entrypoint.d/40-generate-config.sh
COPY etc/nginx.nginx /etc/nginx/conf.d/default.conf
