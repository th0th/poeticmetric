SELECT
  round(avg(visitor_count)) AS average_visitor_count
FROM (
  WITH
    toDateTime(@start) AS start,
    toDateTime(@end) AS end,
    dateDiff('second', start, end) AS diff_seconds,
    multiIf(
      diff_seconds > 31104000, 604800, /* > 360 days - 7 days */
      diff_seconds > 604800, 86400, /* > 7 days - 1 day */
      3600 /* default - 1 hour */
    ) AS interval_seconds
  SELECT
    toDateTime(
      toUInt32(
        toStartOfInterval(
          toDateTime(
            toUInt32(toDateTime(date_time) - start)
          ),
          INTERVAL interval_seconds SECOND
        )
      ) + start
    ) AS date_time,
    count(DISTINCT visitor_id) AS visitor_count
  FROM events_buffer
  WHERE
    date_time < end
    AND date_time >= start
    AND site_id = @siteID
    AND if(isNull(@browserName), TRUE, browser_name = @browserName)
    AND if(isNull(@browserVersion), TRUE, browser_version = @browserVersion)
    AND if(isNull(@countryISOCode), TRUE, country_iso_code = @countryISOCode)
    AND if(isNull(@deviceType), TRUE, device_type = @deviceType)
    AND if(isNull(@language), TRUE, language = @language)
    AND if(isNull(@locale), TRUE, locale = @locale)
    AND if(isNull(@operatingSystemName), TRUE, operating_system_name = @operatingSystemName)
    AND if(isNull(@operatingSystemVersion), TRUE, operating_system_version = @operatingSystemVersion)
    AND if(isNull(@path), TRUE, pathFull(url) = @path)
    AND if(isNull(@referrer), TRUE, referrer = @referrer)
    AND if(isNull(@referrerHost), TRUE, domain(referrer) = @referrerHost)
  GROUP BY date_time
  ORDER BY date_time
  );
