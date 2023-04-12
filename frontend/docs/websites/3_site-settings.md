---
title: Site settings
---

**Site** has these settings:

* [Domain](#domain)
* [Name](#name)
* [Safe query parameters](#safe-query-parameters)
* [Public reports](#public-reports)

<!-- end -->

![site settings](/docs-files/websites/site-settings/site-settings.png "Site settings")

## Domain

**Domain** (or hostname) of the website. This is the most important setting, because **it needs to match the domain of the website that has the [PoeticMetric tracking script](/docs/websites/adding-the-script-to-your-website)**. It can be a [domain](https://en.wikipedia.org/wiki/Domain_name) or a [subdomain](https://en.wikipedia.org/wiki/Subdomain), but it should include protocol (e.g. `https` or `http`), or path information (e.g. `/about`).

## Name

**Name** is the displayed name or title of the site. It is used only for displaying purposes. When there are multiple sites, sites are listed alphabetically on the sites page.

## Safe query parameters

PoeticMetric doesn't store any query parameters since they might include personal data or sensitive information. However, you can add query parameter names that doesn't include any such data, and you want to track. For more details about the query parameters please see [Query parameters](/docs/websites/query-parameters) article.

## Public reports

By default, reports for the website are accessible only to the people with a team member account within your PoeticMetric organization. If you enable this option, reports for the site will be publicly accessible on `https://www.poeticmetric.com/s?d=www.yoursite.com`. This setting come into effect immediately, even if you enabled it earlier, the moment you uncheck this option and click **Save**, public access to website's reports will be disabled.

For example, you can visit PoeticMetric's own reports on [https://www.poeticmetric.com/s?d=www.poeticmetric.com](https://www.poeticmetric.com/s?d=www.poeticmetric.com).
