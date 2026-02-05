---
icon: IconServer
title: Self-hosting
---

You can get your own PoeticMetric Analytics self-hosted website analytics instance up and running in minutes following this guide. It doesn't require any software development expertise, if you are a little tech-savvy you can do it. PoeticMetric is designed to be self-hosted with Docker, and ready-to-use Docker images are published publicly.

If you are curious, there is another documentation article that explains about the parts of PoeticMetric and how these parts communicate with each other. You can check the technical architecture documentation [here](/docs/open-source/technical-architecture).

## Requirements

You will need a server with Docker installed. PoeticMetric has Docker images prebuilt for architectures `linux/amd64` and `linux/arm64`, so make sure your servers CPU is either `x86-64` or `arm64`.

PoeticMetric can run successfully on memory as low as 2GB, however, we recommend allocating at least 4GB of RAM for a smoother experience. However, keep in mind that as the traffic of your website goes up, you might need a more powerful server with a more powerful CPU and more RAM.

<Alert variant="primary">
  If you don't have a server, you can check it out [Hetzner Cloud](https://hetzner.cloud/?ref=IOqhEJnmxLGq) (referral link), we run our servers on their infrastructure, and we can recommend! 
</Alert>

## Versions

When you follow this tutorial, you will be deploying the latest stable version of PoeticMetric. However, a new version of PoeticMetric will be released with new features from time to time. Don't forget to check the section [Updating to a new version](#updating) before you leave.

PoeticMetric Analytics uses [semantic versioning](https://semver.org): `MAJOR.MINOR.PATCH`

* Updates with a `PATCH` version change (e.g. from `v1.0.0` to `v1.0.1`) include small changes, and mostly, bug fixes.
* `MINOR` version changing updates (e.g. from `v1.0.8` to `v1.1.0`) include new features, in a backward compatible manner.
* `MAJOR` version updates include big and important changes, most probably backward incompatible.

Even tough we suggest backing up your data periodically, and especially before performing an update, if you are going for a major version change, please pay extra attention to data backups.

## Running

### Getting the self-hosted files

The Docker Compose configuration lives in the `self-hosted` folder of the repository. Clone the repo and change into that folder:

```shell
$ git clone https://code.unius.sh/poeticmetric/poeticmetric.git
$ cd poeticmetric/self-hosted
```

### Set environment variables

You will find an `.env.example` file that has all the required environment variables with their default values. First, make a copy of this file with the actual file name:

```shell
$ cp .env.example .env
```

You can leave most of them as they are, however, you will need to change some of them:

#### Internal passwords

These variables will be used for setting the password the relevant component on the first run:

* `POETICMETRIC_CLICKHOUSE_PASSWORD`
* `POETICMETRIC_POSTGRES_PASSWORD`
* `POETICMETRIC_RABBITMQ_PASSWORD`
* `POETICMETRIC_VALKEY_PASSWORD`

So, pick a **different**, hard to guess password for each one, and make sure you make note of these. Normally, you won't use any of these passwords while using PoeticMetric. However, if you face any issue, you will need each of them. If you lose one of these passwords, your databases may become inaccessible, and you might lose data.

#### Google Search Console integration variables

`GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are required only for [Google Search Console integration](https://poeticmetric.com/docs/websites/google-search-console-integration). If you are planning to use the integration, you need to obtain them from [Google](https://developers.google.com/webmaster-tools). If you are not planning to use, you can safely skip and leave them as empty. You can also update these variables later.

#### URLs

PoeticMetric has two components that are accessible by HTTP:

* Frontend (`POETICMETRIC_BASE_URL`)
* REST API (`POETICMETRIC_REST_API_BASE_URL`)

By default in `compose.yaml`, the frontend uses port `8000` and the REST API `8001`. If you are not going to use a domain name or a reverse proxy, set these to:

`POETICMETRIC_BASE_URL=http://<your_server_ip_address>:8000`

and

`POETICMETRIC_REST_API_BASE_URL=http://<your_server_ip_address>:8001`

If you are going to use a reverse proxy with a domain name, update `POETICMETRIC_BASE_URL` and `POETICMETRIC_REST_API_BASE_URL` accordingly, and configure two virtual servers on your reverse proxy: one for the frontend (port `8000`) and one for the REST API (port `8001`).

#### SMTP variables

PoeticMetric requires [Simple Mail Transfer Protocol (SMTP)](https://en.wikipedia.org/wiki/Simple_Mail_Transfer_Protocol) for delivering e-mails that are used for notifications, password recovery etc.

Set `POETICMETRIC_SMTP_FROM_ADDRESS`, `POETICMETRIC_SMTP_HOST`, `POETICMETRIC_SMTP_PASSWORD`, `POETICMETRIC_SMTP_PORT` and `POETICMETRIC_SMTP_USER` according to your e-mail service provider.

### Running services

Once you are done setting up your environment variables, you can bring PoeticMetric's services up by:

```shell
$ docker compose up -d
```

If everything goes well, you should be able to access your self-hosted website analytics instance via the frontend URL you set in the [URLs](#urls) step. Go to `http://<your_frontend_base_url>/bootstrap` to initialize the database schemas, and create your account.

## Updating

When a fresh edition of PoeticMetric becomes available, simply follow these steps: temporarily halt PoeticMetric's services, retrieve the latest docker images, and restart the services. PoeticMetric takes care of updating the databases automatically whenever necessary.

```shell
$ docker compose down --remove-orphans
$ docker compose pull
$ docker compose up -d
```

## Getting help

If you have any issues setting up your PoeticMetric Analytics instance, you can open an issue or get help on the [repository](https://code.unius.sh/poeticmetric/poeticmetric).
