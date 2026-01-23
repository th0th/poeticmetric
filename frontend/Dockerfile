FROM node:25.3.0-alpine

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
RUN pnpm run generateSitemap
RUN pnpm run build
RUN pnpm run prerender
RUN pnpm run generateRobotsTxt

FROM nginx:1-alpine

COPY etc/nginx.conf /etc/nginx/conf.d/default.conf
COPY docker-entrypoint.sh /docker-entrypoint.d/01-bootstrap.sh
COPY --from=0 /poeticmetric-frontend-build/dist/common /poeticmetric/common
COPY --from=0 /poeticmetric-frontend-build/dist/hosted/static /poeticmetric/hosted
COPY --from=0 /poeticmetric-frontend-build/dist/non-hosted/static /poeticmetric/non-hosted
