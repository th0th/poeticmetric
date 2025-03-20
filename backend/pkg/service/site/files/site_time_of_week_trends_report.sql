WITH
  toDateTime(@start) AS start,
  toDateTime(@end) AS end,
  (
    SELECT
      count()
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
      AND protocol(referrer) IN ('http', 'https')
      AND if(isNull(@referrer), TRUE, referrer = @referrer)
      AND if(isNull(@referrerHost), TRUE, domain(referrer) = @referrerHost)
  ) AS total_view_count
SELECT
  day_of_week,
  hour_of_day,
  sum(view_count) AS view_count,
  sum(view_percentage) AS view_percentage
FROM (
  SELECT
    arrayJoin(range(1, 8)) AS day_of_week,
    arrayJoin(range(0, 24, 2)) AS hour_of_day,
    0 AS view_count,
    0 AS view_percentage

  UNION ALL

  SELECT
    toDayOfWeek(toTimeZone(date_time, @timeZone)) AS day_of_week,
    toHour(toStartOfInterval(toTimeZone(date_time, @timeZone), INTERVAL 2 HOUR)) AS hour_of_day,
    count() AS view_count,
    round(100 * view_count / total_view_count, 2) AS view_percentage
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
    AND protocol(referrer) IN ('http', 'https')
    AND if(isNull(@referrer), TRUE, referrer = @referrer)
    AND if(isNull(@referrerHost), TRUE, domain(referrer) = @referrerHost)
  GROUP BY day_of_week, hour_of_day
  )
GROUP BY day_of_week, hour_of_day
ORDER BY day_of_week, hour_of_day
