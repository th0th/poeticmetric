---
title: What we collect
---

While designing PoeticMetric, our top priority is the safety and privacy of the visitor. When deciding on whether to collect some data, before weighing the convenience, we ask the questions, *"Is this personal data? Even if not, might this ease the behavioral analysis of the visitor?"*

### Timestamp

**We collect the timestamps.**

We use timestamps to provide charts and reports for a specific period and help you analyze your site's traffic changes.

### URL

**We collect the hostname, path, and UTM query parameters portions of the URL.**

For example, if a visitor visits

```
https://www.yoursite.com/some-blog-post?utm_campaign=twitter&userId=11
```

we omit the userId (and all other UTM-unrelated query parameters to be accurate) and collect

```
https://www.yoursite.com/some-blog-post?utm_campaign=twitter
```

The reason we discard the query parameters is that query parameters might ease pinpointing an individual visitor.

### User agent

**We collect user agents to detect device type, operating system, and browser information.**

We aggregate device type (desktop, tablet, or mobile phone), operating system (name and version), and browser (name and version) information to provide a technological analysis. We don't combine user agent with some other data to fingerprint the visitor.

### Referrer

**We collect referrers.**

Technically, [the referrer](https://en.wikipedia.org/wiki/HTTP_referer) is the previous page the visitor visited before your site. We use referrers to help you understand the external source of your page visits.

### Country

**We collect countries.**

The country is the only geographical data we collect.

Unlike most other tools and services, we don't use IP-based technologies (GeoIP) to detect visitors' country. We use the device's time zone to infer the country.

### Language

**We collect languages.**

We collect the language device that is used as the visitor's language.

### UTM parameters

**We collect UTM parameters.**

[Urchin Tracking Module (UTM) parameters](https://en.wikipedia.org/wiki/UTM_parameters) are URL parameters used to understand the effectiveness of online marketing campaigns. We collect all five UTM parameters: `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`

## What we don't collect

### IP address

**We don't collect IP addresses.**

The IP address is the most common visitor identifying data point. It enables tracking visitors across browsers or even devices. That's why we rule out the source IP address of every incoming request. We don't process, collect or hash the IP address.

### Cookies

**We don't use cookies or any other similar technology.**

Cookies or similar persistence browser data storages like local storage enable tracking visitors across sessions. Utilization of these technologies requires taking consent from the visitor according to privacy regulations like GDPR, CCPA or PECR.
