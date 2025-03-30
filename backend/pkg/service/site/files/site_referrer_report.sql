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
      AND domain(referrer) != domain(url)
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
      AND if(isNull(@utmCampaign), TRUE, domain(utm_campaign) = @utmCampaign)
      AND if(isNull(@utmContent), TRUE, domain(utm_content) = @utmContent)
      AND if(isNull(@utmMedium), TRUE, domain(utm_medium) = @utmMedium)
      AND if(isNull(@utmSource), TRUE, domain(utm_source) = @utmSource)
      AND if(isNull(@utmTerm), TRUE, domain(utm_term) = @utmTerm)
  ) AS total_visitor_count
SELECT
  *
FROM (
  SELECT
    referrer,
    domain(referrer) AS referrer_host,
    pathFull(referrer) AS referrer_path,
    count(DISTINCT visitor_id) AS visitor_count,
    round(100 * visitor_count / total_visitor_count, 2) AS visitor_percentage
  FROM events_buffer
  WHERE
    date_time < end
    AND date_time >= start
    AND site_id = @siteID
    AND domain(referrer) != domain(url)
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
    AND if(isNull(@utmCampaign), TRUE, domain(utm_campaign) = @utmCampaign)
    AND if(isNull(@utmContent), TRUE, domain(utm_content) = @utmContent)
    AND if(isNull(@utmMedium), TRUE, domain(utm_medium) = @utmMedium)
    AND if(isNull(@utmSource), TRUE, domain(utm_source) = @utmSource)
    AND if(isNull(@utmTerm), TRUE, domain(utm_term) = @utmTerm)
  GROUP BY referrer
  )
WHERE
  if(
    isNull(@paginationVisitorCount) AND isNull(@paginationReferrer),
    TRUE,
    visitor_count < @paginationVisitorCount OR (visitor_count = @paginationVisitorCount AND referrer < @paginationReferrer)
  )
ORDER BY visitor_count DESC
LIMIT @limit;
