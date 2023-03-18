FROM node:19.7-alpine

RUN apk update && apk add bash

ARG BASE_URL
ARG GOOGLE_CLIENT_ID
ARG HOSTED=false
ARG NODE_RED_BASE_URL
ARG ROBOTS_TXT_ALLOW=false
ARG SENTRY_AUTH_TOKEN
ARG SENTRY_DSN
ARG SENTRY_ENVIRONMENT
ARG SENTRY_ORG
ARG SENTRY_PROJECT
ARG STRIPE_PUBLISHABLE_KEY

WORKDIR /poeticmetric-frontend-builder

# copy only package definition files
COPY package.json .
COPY package-lock.json .

# install dependencies
RUN npm install

# copy the rest of the files
COPY @types @types
COPY blog blog
COPY components components
COPY contexts contexts
COPY docs docs
COPY helpers helpers
COPY hooks hooks
COPY lib lib
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
ENV NEXT_PUBLIC_GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
ENV NEXT_PUBLIC_HOSTED=${HOSTED}
ENV NEXT_PUBLIC_NODE_RED_BASE_URL=${NODE_RED_BASE_URL}
ENV NEXT_PUBLIC_ROBOTS_TXT_ALLOW=${ROBOTS_TXT_ALLOW}
ENV NEXT_PUBLIC_SENTRY_DSN=${SENTRY_DSN}
ENV NEXT_PUBLIC_SENTRY_ENVIRONMENT=${SENTRY_ENVIRONMENT}
ENV NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=${STRIPE_PUBLISHABLE_KEY}
ENV SENTRY_AUTH_TOKEN=${SENTRY_AUTH_TOKEN}
ENV SENTRY_ORG=${SENTRY_ORG}
ENV SENTRY_PROJECT=${SENTRY_PROJECT}

COPY scripts/build.sh .

RUN ./build.sh

FROM nginx:1.23-alpine

RUN apk update && apk add bash

WORKDIR /poeticmetric-frontend

COPY --from=0 /poeticmetric-frontend-builder/out /usr/share/nginx/html
COPY scripts/generate-config.sh /docker-entrypoint.d/40-generate-config.sh
COPY etc/nginx.nginx /etc/nginx/conf.d/default.conf
