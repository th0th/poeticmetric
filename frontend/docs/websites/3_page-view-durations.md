---
title: "Page view durations"
---

How much time a visitor spends on a page is one of the critical engagement metrics of web analytics. However, it is tricky to measure in an accurate and privacy-friendly manner.

## Google Analytics (and most of the other tools)

**Google Analytics** measures time spent on the page like this: Visitor lands on your website at a particular time. When this visitor navigates to another page on your site, Google Analytics considers all the time between these two events as the "time on page". ** This approach requires tracking the visitor by a unique identifier, IP address, or a cookie.** In addition to that, the evaluation by this method is inaccurate and inadequate, too. Consider these cases:

### Case#1: Visitor views a single page

If the visitor views a single page on your site and then leaves the site closing the tab, the duration is not measured at all. In this case, the duration data is totally lost.

### Case#2: Visitor switches tabs on their browser

If the visitor lands on a page on your website, switches tab on their browser for some time, and then returns to the tab that your site is on, the actual duration shouldn't include the time they were on the other tab, right?

## PoeticMetric

PoeticMetric measures the page view duration as accurately as possible.

* The duration data is saved just before the visitor leaves the page (or the tab). So, even if the visitor doesn't navigate to a second page on your site, the duration is safely measured and saved.
* Also, if the visitor has your site open on a browser tab, the time they spend viewing another site on another tab is properly deducted and not considered as the page view duration.

### Sacrificed data point: Session duration

As stated in the previous section, tracking a visitor between pages (i.e. along a session) requires attaching a certain identifier to that specific visitor. [**This is what we definitely don't do at PoeticMetric.**](/manifesto#1-being-privacy-first) So, we had to sacrifice the **session duration** data point in order to stay privacy-focused and compliant with the personal data privacy regulations.
