FROM node:24-alpine

WORKDIR /poeticmetric-frontend-build

RUN npm install --global pnpm

# copy only package definition files
COPY package.json .
COPY pnpm-lock.yaml .

# install modules
RUN pnpm install

# copy the rest of the files
COPY public public
COPY scripts scripts
COPY src src
COPY index.html .
COPY tsconfig.json .
COPY tsconfig.node.json .
COPY vite.config.ts .

# build and export
RUN pnpm run generateBlogFeed
RUN pnpm run generateRobotsTxt
RUN pnpm run generateSitemap
RUN pnpm run prerender

FROM nginx:1-alpine

WORKDIR /usr/share/nginx/html

COPY etc/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=0 /poeticmetric-frontend-build/dist/static /usr/share/nginx/html
COPY docker-entrypoint.sh /docker-entrypoint.d/01-bootstrap.sh
