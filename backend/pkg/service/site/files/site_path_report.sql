WITH
  toDateTime(@start) AS start,
  toDateTime(@end) AS end
SELECT
  *
FROM (
  SELECT
    round(avg(duration_seconds)) AS average_duration_seconds,
    round(100 * countIf(duration_seconds == 0) / count(*)) AS bounce_percentage,
    pathFull(url) AS path,
    count(path) AS view_count,
    count(DISTINCT visitor_id) AS visitor_count,
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
  GROUP BY url
  ORDER BY visitor_count DESC
  )
WHERE
  if(
    isNull(@paginationVisitorCount),
    TRUE,
    visitor_count < @paginationVisitorCount OR (visitor_count = @paginationVisitorCount AND path < @paginationPath)
  )
LIMIT @limit;
