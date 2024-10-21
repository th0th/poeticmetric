FROM node:23-alpine

RUN apk update && apk add bash
RUN npm install --global pnpm

WORKDIR /unius-analytics

# copy only package definition files
COPY package.json .
COPY pnpm-lock.yaml .

# install dependencies
RUN pnpm install

# copy the rest of the files
COPY public public
COPY src src
COPY index.html .
COPY server.js .
COPY tailwind.config.ts .
COPY tsconfig.json .
COPY tsconfig.node.json .
COPY vite.config.ts .

COPY docker-entrypoint.development.sh /usr/local/bin/docker-entrypoint.sh

EXPOSE 80

ENTRYPOINT ["docker-entrypoint.sh"]
