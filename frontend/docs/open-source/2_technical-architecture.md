---
title: Technical architecture
---

In this article, we will explore the technical software architecture that drives PoeticMetric Analytics, highlighting the core principles of transparency and openness that are at the heart of our platform. Built upon open source technologies, PoeticMetric Analytics is designed to provide website owners with a comprehensive and privacy-first web analytics solution. By understanding the underlying technical architecture, you gain insights into how your data is collected, processed, and stored, ensuring full transparency and control over your analytics experience. Let's dive into the details of PoeticMetric's software architecture and discover how open source empowers you to make informed decisions about your data.

<!-- end -->

## An overview of PoeticMetric's topology

<a href="/docs-files/open-source/technical-architecture/topology.png" target="_blank">
    <figure>
        <img alt="Software architecture (topology)" src="/docs-files/open-source/technical-architecture/topology.png">
        <figcaption>
            PoeticMetric's architecture
        </figcaption>
    </figure>
</a>

## Components

### Data storage

#### PostgreSQL

PoeticMetric relies on [PostgreSQL](https://www.postgresql.org) as its primary, source-of-truth database, serving as a secure repository for essential data such as account details, website information, and team member records. PostgreSQL, a widely recognized and battle-tested open source database, plays a pivotal role in ensuring the reliability and robustness of PoeticMetric's data storage. With its powerful features and established reputation, PostgreSQL forms a solid foundation for the flawless functioning of PoeticMetric's analytics platform.

#### ClickHouse

PoeticMetric leverages the power of [ClickHouse](https://clickhouse.com), an open source and high-performance OLAP database management system, specifically designed to meet the demanding needs of analytics. As the storage and querying solution for analytics data, ClickHouse empowers PoeticMetric to deliver lightning-fast insights. With its exceptional speed, ClickHouse facilitates millisecond-level reporting, allowing users to obtain near-instantaneous results. By harnessing the capabilities of ClickHouse, PoeticMetric ensures that analytics data is efficiently stored and readily available, enabling swift and accurate analysis for a smooth user experience.

#### RabbitMQ

While PoeticMetric is primarily developed as a monolithic application, it incorporates multiple components resembling a microservices infrastructure, enabling seamless communication between these parts. This crucial inter-component communication is facilitated by [RabbitMQ](https://www.rabbitmq.com), a fundamental element of PoeticMetric's architecture. By serving as a reliable message broker, RabbitMQ ensures that the various components of PoeticMetric work harmoniously together. This integration of RabbitMQ within PoeticMetric's framework plays a vital role in maintaining the system's overall efficiency and effectiveness.

#### Redis

PoeticMetric leverages the power of [Redis](https://redis.io), a high-performance key-value storage system, to store transient data such as the daily changing visitor encryption salt. While this ephemeral information could be stored in any database, Redis offers the advantage of simplified expiry management. By utilizing Redis, PoeticMetric can effortlessly handle the expiration of this data as required. Redis has garnered acclaim within the open source community for its exceptional performance in key-value storage scenarios, further solidifying its suitability for PoeticMetric's needs.` 

### Backend

PoeticMetric's backend is a robust Golang application comprising three distinct components:

#### REST API

The REST API serves as the vital bridge between the frontend and the business logic in PoeticMetric, ensuring smooth connectivity by consuming data from PostgreSQL and ClickHouse databases.

It primarily:

* Connects the frontend to the business logic, facilitating smooth connectivity.
* Consumes data from PostgreSQL and ClickHouse databases.
* Enables frontend interactions with the PostgreSQL database for account-related tasks like sign-up, sign-in, and password recovery.
* Processes data collected by the tracker on customer websites and inserts it into the ClickHouse database for analysis.
* Retrieves relevant data from both PostgreSQL and ClickHouse databases to generate comprehensive site reports.
* Provides API access for third-party external applications, promoting integration and extensibility with external systems.

#### Worker

The worker component in PoeticMetric operates as a background task executor, ensuring asynchronous processing. It consumes messages from RabbitMQ queues and efficiently writes the resulting outcomes to both PostgreSQL and ClickHouse databases.

By separating long-running operations from the REST API and delegating them to the worker as a distinct process, PoeticMetric enables uninterrupted request-response cycles within the API. This approach prevents blocking and allows the REST API to promptly handle incoming requests. Moreover, it facilitates the efficient handling of a large volume of tasks, as the worker can be scaled accordingly to meet the demands of the workload.

#### Scheduler

The scheduler, a compact component within PoeticMetric's backend, serves the purpose of adding scheduled task messages to the RabbitMQ queues for consumption by the worker. It focuses solely on efficiently queuing time-based tasks, ensuring they are appropriately dispatched for processing by the worker component.

### Frontend

PoeticMetric's frontend is an impressive Next.js React application developed in TypeScript. To optimize its performance, the application is not executed as a Node.js application; instead, it is exported as static HTML, CSS, and JS files during the build process. This approach enables the frontend to be lightweight and easily served by web servers such as NGINX or Apache. The official Docker image of PoeticMetric employs NGINX for this purpose. The frontend application incorporates several exceptional open source libraries, including, but not limited to:

* [Bootstrap](https://getbootstrap.com) and [React Bootstrap](https://react-bootstrap.github.io) for streamlined and responsive UI components.
* [Lodash](https://lodash.com) for efficient data manipulation and utility functions.
* [SWR](https://swr.vercel.app) for data fetching and caching, enhancing the performance of API requests.
* [visx](https://airbnb.io/visx/) for powerful and customizable data visualization components, enabling captivating and informative graphical representations.
