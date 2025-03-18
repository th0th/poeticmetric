WITH
  toDateTime(@start) AS start,
  toDateTime(@end) AS end,
  (
    SELECT
      count(DISTINCT visitor_id)
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
      AND if(isNull(@referrerHost), TRUE, domain(referrer) = @referrerHost)
  ) AS total_visitor_count
SELECT
  *
FROM (
  SELECT
    domain(referrer) AS referrer_host,
    count(DISTINCT visitor_id) AS visitor_count,
    round(100 * visitor_count / total_visitor_count, 2) AS visitor_percentage
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
    AND if(isNull(@referrerHost), TRUE, domain(referrer) = @referrerHost)
  GROUP BY referrer_host
  )
WHERE
  if(
    isNull(@paginationVisitorCount) AND isNull(@paginationReferrerHost),
    TRUE,
    visitor_count < @paginationVisitorCount OR (visitor_count = @paginationVisitorCount AND referrer_host < @paginationReferrerHost)
  )
ORDER BY visitor_count DESC
LIMIT @limit;
