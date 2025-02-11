FROM node:23-alpine

RUN apk update && apk add bash
RUN npm install --global pnpm

WORKDIR /poeticmetric

COPY package.json .
COPY pnpm-lock.yaml .

RUN pnpm install

COPY public public
COPY src src
COPY index.html .
COPY server.js .
COPY tsconfig.json .
COPY tsconfig.node.json .
COPY vite.config.ts .

ARG IS_HOSTED=false
ARG TAGS_ENVIRONMENT

ENV VITE_IS_HOSTED=${IS_HOSTED}
ENV VITE_TAGS_ENVIRONMENT=${TAGS_ENVIRONMENT}

RUN pnpm build

COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh

EXPOSE 80

ENTRYPOINT ["docker-entrypoint.sh"]
