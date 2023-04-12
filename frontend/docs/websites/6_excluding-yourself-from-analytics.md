---
title: "Excluding yourself from analytics"
---

By default, once you add PoeticMetric script on your website, PoeticMetric tracks every visitor. But you might want to exclude yourself and your team from affecting the statistics.

<!-- end -->

You might be familiar with this process and look for a way to ignore some IP addresses on the PoeticMetric interface. However, since [we don't collect, encrypt or process IP addresses as a privacy feature](/docs/what-we-collect), IP address filtering is not available on PoeticMetric. Instead, you will need to set a `localStorage` flag to let the tracker script know, and it will exclude you and stop event collection.

## tl;dr, to exclude yourself:

1. Go to your website, which you have the PoeticMetric script installed.

2. Open your browser's javascript console.

    * For **Google Chrome**, you can select **View > Developer > JavaScript Console** ([screenshot](/docs-files/websites/excluding-yourself-from-analytics/google-chrome.png)). Or press `Command + Option + J` on **MacOS**, `Control + Shift + J` on **Windows, Linux and Chrome OS**.

    * For **Safari**, first, you [need to enable **Developer tools**](https://support.apple.com/guide/safari/use-the-developer-tools-in-the-develop-menu-sfri20948/mac). Then you can select **Develop > Show JavaScript Console** ([screenshot](/docs-files/websites/excluding-yourself-from-analytics/safari.png)). Or press `Command + Option + C`.

    * For **Mozilla Firefox**, you can select **Menu > More tools > Browser console** ([screenshot](/docs-files/websites/excluding-yourself-from-analytics/mozilla-firefox.png)). Or press `Command + Shift + J` on **MacOS**, `Control + Shift + J` on **Windows**.

3. Then paste this and press enter:

   ```javascript
   window.localStorage.pmIgnore=1
   ```

Well done! From now on, as soon as you have this flag in your `localStorage` your events from this browser will be ignored. If you use multiple browsers, don't forget to do this in each one.
