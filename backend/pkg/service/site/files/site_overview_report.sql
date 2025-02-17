WITH
  toDateTime(@start) AS start,
  toDateTime(@end) AS end,
  timeDiff(start, end) AS diff_seconds,
  start - INTERVAL diff_seconds SECOND AS start2,
  end - INTERVAL diff_seconds SECOND AS end2,
  (
    SELECT
      round(
        avg(
          CASE
            WHEN duration_seconds > 0 THEN duration_seconds
          END
        )
      ) AS average_page_view_duration_seconds,
      count(*) AS page_view_count,
      if(isFinite(page_view_count / visitor_count), round(page_view_count / visitor_count, 1), 0) AS page_view_count_per_visitor,
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
  ) AS previous
SELECT
  toUInt64(
    round(
      avg(
        CASE
          WHEN duration_seconds > 0 THEN duration_seconds
        END
      )
    )
  ) AS average_page_view_duration_seconds,

  toInt16(
    round(
      100 * (average_page_view_duration_seconds - previous.average_page_view_duration_seconds) /
      previous.average_page_view_duration_seconds
    )
  ) AS average_page_view_duration_seconds_percentage_change,

  count(*) AS page_view_count,

  if(
    previous.page_view_count != 0,
    toInt16(
      round(
        100 * (page_view_count - previous.page_view_count) / previous.page_view_count
      )
    ),
    NULL
  ) AS page_view_count_percentage_change,

  if(isFinite(page_view_count / visitor_count), round(page_view_count / visitor_count, 1), 0) AS page_view_count_per_visitor,

  if(
    previous.page_view_count_per_visitor != 0,
    toInt16(
      round(
        100 * (page_view_count_per_visitor - previous.page_view_count_per_visitor) / previous.page_view_count_per_visitor
      )
    ),
    NULL
  ) AS page_view_count_per_visitor_percentage_change,

  count(DISTINCT visitor_id) AS visitor_count,

  if(
    previous.visitor_count != 0,
    toInt16(
      round(
        100 * (visitor_count - previous.visitor_count) / previous.visitor_count
      )
    ),
    NULL
  ) AS visitor_count_percentage_change
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
  AND if(isNull(@referrer), TRUE, referrer = @referrer);
