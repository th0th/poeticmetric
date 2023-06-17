FROM node:20.3.0-alpine

RUN apk update && apk add bash
RUN npm install --global pnpm

WORKDIR /poeticmetric

# copy only package definition files
COPY package.json .
COPY pnpm-lock.yaml .

# install dependencies
RUN pnpm install

COPY @types @types
COPY app app
COPY blog blog
COPY components components
COPY components2 components2
COPY contexts contexts
COPY contexts2 contexts2
COPY docs docs
COPY helpers helpers
COPY helpers2 helpers2
COPY hooks hooks
COPY hooks2 hooks2
COPY lib lib
COPY public public
COPY styles styles
COPY tests tests
COPY mdx-components.tsx .
COPY next.config.js .
COPY playwright.config.ts .
COPY sentry.client.config.js .
COPY sentry.server.config.js .
COPY tsconfig.json .

EXPOSE 80

CMD ["pnpm", "run", "dev"]
