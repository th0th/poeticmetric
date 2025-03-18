WITH
  toDateTime(@start) AS start,
  toDateTime(@end) AS end,
  (
    SELECT
      count(*) AS view_count,
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
  ) AS total
SELECT
  *
FROM (
  SELECT
    round(avg(duration_seconds)) AS average_duration_seconds,
    round(100 * countIf(duration_seconds == 0) / count(*), 2) AS bounce_percentage,
    pathFull(url) AS path,
    count(path) AS view_count,
    round(100 * view_count / total.view_count, 2) AS view_percentage,
    count(DISTINCT visitor_id) AS visitor_count,
    round(100 * visitor_count / total.visitor_count, 2) AS visitor_percentage,
    url
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
  GROUP BY url
  )
WHERE
  if(
    isNull(@paginationVisitorCount) and isNull(@paginationPath),
    TRUE,
    visitor_count < @paginationVisitorCount OR (visitor_count = @paginationVisitorCount AND path < @paginationPath)
  )
ORDER BY visitor_count DESC
LIMIT @limit;
