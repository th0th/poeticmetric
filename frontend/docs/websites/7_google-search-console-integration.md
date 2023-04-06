---
title: "Google Search Console integration"
---

Google Search Console provides some Google related statistics about your website, like what people, who see your website in the search results, use as the search term, and how many of them actually click your site on the results.

HTTP (The Hypertext Transfer Protocol) has a specific way of handling the passing of the referrer information on [RFC 9110 - HTTP Semantics](https://httpwg.org/specs/rfc9110.html#field.referer). According to this specification, when a link is clicked, URL of the page which has the link is passed via the [`Referer`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referer) header to the new page. However, since this behavior is [considered to cause undesirable consequences for user security and privacy](https://developer.mozilla.org/en-US/docs/Web/Security/Referer_header:_privacy_and_security_concerns), many sites including Google started handling referrers differently. That's why PoeticMetric can't see which search term your visitor used on Google, and need to use Google Search Console integration to obtain this data from Google.

![google search terms report details](/docs-files/websites/google-search-console-integration/google-search-terms-report-details.png "Google search terms report details")

With this integration, PoeticMetric enables you to see

* the **search terms** that list your website as a result,
* **your website's position** for search terms,
* **CTR** (click-through rate),
* number of **impressions** and
* and number of **clicks**.

## Adding your site to Google Search Console

To get your website's search statistics from Google, you need to add your site to Google Search Console. To do so, go to https://search.google.com/search-console and follow the steps. If you need help at some point, you can consult to [Google's guide](https://support.google.com/webmasters/answer/34592).

![google search console - add property](/docs-files/websites/google-search-console-integration/google-search-console-add-property.png "Google Search Console - Add property")

## Enable the integration for your site on PoeticMetric

To enable the Google Search Console Integration for your website on PoeticMetric:

1. Go to **Sites**, and click the **Edit** button below the website you would like to add the integration for.

   ![edit site](/docs-files/websites/google-search-console-integration/edit-site.png "Edit site")

2. Enable the **Show Google Search Console reports** option.

   ![enable the show google search console reports option](/docs-files/websites/google-search-console-integration/show-google-search-console-reports.png "Enable the Show Google Search Console reports option.")

3. Click the button that says **Connect with Google**, and follow the steps. This will allow PoeticMetric to access the Google Search Console data.

4. Once connecting with Google is completed, select the property for this site on the dropdown.

   ![select the google search console option](/docs-files/websites/google-search-console-integration/select-the-google-search-console-option.png "Select the Google Search Console option")

5. And then click the **Save** button.

   ![save](/docs-files/websites/google-search-console-integration/save.png "Save")

After you enable the integration, a new report will be visible in the **Sources** part. You can select the **Google search terms** reports from the dropdown there.

![google search terms report](/docs-files/websites/google-search-console-integration/google-search-terms-report.png "Google search terms report")

