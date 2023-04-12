---
title: "Query parameters"
---

**Query parameters** (also known as "query string" or "URL parameters") are the part of the **URL** (uniform resource locator) that comes after the question mark **(?)**.

<!-- end -->

Query parameters consist of a key and a value, separated by an equal sign (=). And if there are multiple parameters, each is separated by an ampersand (&).

![query parameters in the address bar](/docs-files/websites/query-parameters/address-bar.jpg "Query parameters in the address bar")

According to [RFC 3986](https://www.rfc-editor.org/rfc/rfc3986#section-3.4);

> the query component contains non-hierarchical data that, along with data in the path component, serves to identify a resource within the scope of the URI's scheme and naming authority (if any)

## Query parameters on PoeticMetric

Query parameters often include personal or sensitive information. For example, consider a form that autofills the e-mail address field from query parameters. The full URL would look like something like this

`https://www.yoursite.com/?email=gordon@blackmesa.tld`

And sometimes, one page has multiple kinds of content, and the query parameters are used for identifying what to display.

`https://www.yoursite.com/?tab=profile`

Since there is no easy way to differentiate personal data containing query parameters from those not, by default, we strip all the query parameters, except UTM-related ones. However, you can set the safe query parameters in your site's settings, and PoeticMetric will collect those as a part of the page's URL.

### Setting safe query parameters

To set safe query parameters for your website on PoeticMetric:

1. Go to **Sites**, and click the **Edit** button below the website you would like to set safe query parameters for.

   ![edit site](/docs-files/websites/query-parameters/edit-site.png "Edit site")

2. Under the **Safe query parameters** section, type the query parameter you want to add and press enter.

   ![set query parameters in PoeticMetric site settings](/docs-files/websites/query-parameters/update-safe-query-parameters.png "Set safe query parameters in PoeticMetric site settings")

3. Repeat the process for each query parameter you want to add.

4. Click on the **Save** button.
