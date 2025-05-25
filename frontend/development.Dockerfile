FROM node:24-alpine

RUN apk update && apk add bash
RUN npm install --global pnpm

WORKDIR /poeticmetric

# copy only package definition files
COPY package.json .
COPY pnpm-lock.yaml .

# install dependencies
RUN pnpm install

# copy the rest of the files
COPY public public
COPY scripts scripts
COPY src src
COPY index.html .
COPY server.js .
COPY tsconfig.json .
COPY tsconfig.node.json .
COPY vite.config.ts .

COPY docker-entrypoint.development.sh /usr/local/bin/docker-entrypoint.sh

EXPOSE 80

CMD ["docker-entrypoint.sh"]
