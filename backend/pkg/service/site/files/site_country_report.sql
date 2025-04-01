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
      AND country_iso_code IS NOT NULL
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
      AND if(isNull(@utmCampaign), TRUE, utm_campaign = @utmCampaign)
      AND if(isNull(@utmContent), TRUE, utm_content = @utmContent)
      AND if(isNull(@utmMedium), TRUE, utm_medium = @utmMedium)
      AND if(isNull(@utmSource), TRUE, utm_source = @utmSource)
      AND if(isNull(@utmTerm), TRUE, utm_term = @utmTerm)
  ) AS total_visitor_count
SELECT
  *
FROM (
  SELECT
    country_iso_code,
    count(DISTINCT visitor_id) AS visitor_count,
    round(100 * visitor_count / total_visitor_count, 2) AS visitor_percentage
  FROM events_buffer
  WHERE
    date_time < end
    AND date_time >= start
    AND site_id = @siteID
    AND country_iso_code IS NOT NULL
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
    AND if(isNull(@utmCampaign), TRUE, utm_campaign = @utmCampaign)
    AND if(isNull(@utmContent), TRUE, utm_content = @utmContent)
    AND if(isNull(@utmMedium), TRUE, utm_medium = @utmMedium)
    AND if(isNull(@utmSource), TRUE, utm_source = @utmSource)
    AND if(isNull(@utmTerm), TRUE, utm_term = @utmTerm)
  GROUP BY country_iso_code
  )
WHERE
  if(
    isNull(@paginationVisitorCount) AND isNull(@paginationCountryISOCode),
    TRUE,
    visitor_count < @paginationVisitorCount OR (visitor_count = @paginationVisitorCount AND country_iso_code < @paginationCountryISOCode)
  )
ORDER BY visitor_count DESC
LIMIT @limit;
